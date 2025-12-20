const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

async function contributeQuestion(req, res) {
  try {
    const db = getDB();
    const { subject, chapter, qstnText, options, imgUrl } = req.body;
    const uid = req.user.uid;

    const parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;

    const newQuestion = {
      Chapter: chapter,
      qstnText,
      imgUrl: imgUrl || '',
      options: parsedOptions,
      contributedBy: uid,
      createdAt: new Date(),
    };

    const subjectDoc = await db.collection('generalQuestions').findOne({ subject });

    if (subjectDoc) {
      await db.collection('generalQuestions').updateOne(
        { subject },
        { $push: { Questions: newQuestion } }
      );
    } else {
      await db.collection('generalQuestions').insertOne({
        subject,
        Questions: [newQuestion],
      });
    }

    res.status(201).json({ success: true, message: 'Question added successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error contributing question.', error: err });
  }
}

async function getContributedQuestions(req, res) {
  try {
    const db = getDB();
    const uid = req.user.uid;

    const pipeline = [
      { $unwind: '$Questions' },
      { $match: { 'Questions.contributedBy': uid } },
      {
        $project: {
          subject: 1,
          Chapter: '$Questions.Chapter',
          qstnText: '$Questions.qstnText',
          imgUrl: '$Questions.imgUrl',
          options: '$Questions.options',
          createdAt: '$Questions.createdAt',
        },
      },
    ];

    const results = await db.collection('generalQuestions').aggregate(pipeline).toArray();
    res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching questions.' });
  }
}

async function createContest(req, res) {
  try {
    const db = getDB();
    const teacherId = req.user.uid;
    const { contestName, questions } = req.body;

    if (!contestName || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const teacherDoc = await db.collection('createContest').findOne({ teacherId });

    let serial = 1;
    if (teacherDoc && teacherDoc.contests) {
      serial = teacherDoc.contests.length + 1;
    }

    const serialStr = serial.toString().padStart(3, '0');
    const prefix = teacherId.slice(0, 6).toUpperCase();
    const refCode = `${prefix}-${serialStr}`;

    const formattedQuestions = questions.map((q, index) => ({
      qstnID: `Q${index + 1}`,
      qstnText: q.qstnText,
      imgUrl: q.imgUrl || '',
      options: q.options.map((opt) => ({
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
      })),
    }));

    const newContest = {
      refCode,
      contestName,
      questions: formattedQuestions,
      createdAt: new Date(),
    };

    if (teacherDoc) {
      await db.collection('createContest').updateOne(
        { teacherId },
        { $push: { contests: newContest } },
        { upsert: true }
      );
    } else {
      await db.collection('createContest').insertOne({
        teacherId,
        contests: [newContest],
      });
    }

    res.send(newContest);
  } catch (error) {
    console.error('Error creating contest:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function getContests(req, res) {
  try {
    const db = getDB();
    const teacherId = req.user.uid;
    const teacherDoc = await db.collection('createContest').findOne({ teacherId });

    if (!teacherDoc || !teacherDoc.contests || teacherDoc.contests.length === 0) {
      return res.status(404).json({ message: 'No contests found' });
    }

    res.status(200).json({ contests: teacherDoc.contests });
  } catch (err) {
    console.error('Error fetching contests:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function dashContest(req, res) {
  try {
    const db = getDB();
    const teacherId = req.user.uid;
    const teacherDoc = await db.collection('createContest').findOne({ teacherId });

    if (!teacherDoc || !teacherDoc.contests) {
      return res.json({ contests: [] });
    }

    const contests = teacherDoc.contests;

    const contestData = await Promise.all(
      contests.map(async (contest) => {
        const refCode = contest.refCode;
        const submissions = await db
          .collection('contestSubmissions')
          .find({ refCode })
          .project({ score: 1, total: 1, submittedAt: 1 })
          .toArray();

        const totalSubs = submissions.length;
        const totalScore = submissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
        const avgScore =
          totalSubs > 0
            ? Math.round((totalScore / (totalSubs * (submissions[0].total || 1))) * 100)
            : 0;

        const daysAgo = Math.floor((new Date() - new Date(contest.createdAt)) / (1000 * 60 * 60 * 24));

        return {
          title: contest.contestName,
          submissions: totalSubs,
          avgScore,
          created: daysAgo === 0 ? 'Today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`,
        };
      })
    );

    res.json({ contests: contestData });
  } catch (err) {
    console.error('Error fetching contests:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function viewResponses(req, res) {
  try {
    const db = getDB();
    const { code } = req.params;
    const submissions = await db
      .collection('contestSubmissions')
      .find({ refCode: code })
      .project({ _id: 0, uid: 1, score: 1, total: 1 })
      .toArray();

    res.json(submissions);
  } catch (err) {
    console.error('Error fetching responses backend', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function viewResponse(req, res) {
  try {
    const db = getDB();
    const studentId = req.params.studentId;
    const contestCode = req.params.code;

    const submission = await db.collection('contestSubmissions').findOne(
      { uid: studentId, refCode: contestCode },
      { projection: { _id: 0, answers: 1 } }
    );

    if (!submission) return res.status(404).json({ message: 'Not found' });

    const contestDoc = await db
      .collection('createContest')
      .findOne({ 'contests.refCode': contestCode }, { projection: { 'contests.$': 1 } });

    if (!contestDoc || !contestDoc.contests || contestDoc.contests.length === 0) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const contest = contestDoc.contests[0];
    res.json({
      contestName: contest.contestName,
      questions: contest.questions,
      answers: submission.answers,
    });
  } catch (err) {
    console.error('error in backend', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function leaderboard(req, res) {
  try {
    const db = getDB();
    const refCode = req.params.code;

    const submissions = await db
      .collection('contestSubmissions')
      .find({ refCode })
      .project({ _id: 0, uid: 1, score: 1, total: 1 })
      .sort({ score: -1 })
      .toArray();

    res.json(submissions);
  } catch (err) {
    console.error('Error fetching leaderboard backend', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  contributeQuestion,
  getContributedQuestions,
  createContest,
  getContests,
  dashContest,
  viewResponses,
  viewResponse,
  leaderboard,
};
