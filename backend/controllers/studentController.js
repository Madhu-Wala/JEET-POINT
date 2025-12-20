const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const shuffleArray = require('../utils/shuffle');

async function getContestForStudent(req, res) {
  try {
    const db = getDB();
    const contestCode = req.params.code;
    const uid = req.user.uid;

    const existing = await db.collection('contestSubmissions').findOne({
      uid,
      refCode: contestCode,
    });
    if (existing) {
      return res.status(403).json({ message: 'Already attempted' });
    }

    const result = await db.collection('createContest').findOne(
      { 'contests.refCode': contestCode },
      { projection: { 'contests.$': 1 } }
    );

    if (!result || !result.contests || result.contests.length === 0) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const contest = result.contests[0];

    const sanitizedQuestions = contest.questions.map((q) => ({
      qstnText: q.qstnText,
      imgUrl: q.imgUrl,
      options: q.options.map((opt) => ({
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
      })),
    }));

    const response = {
      contestName: contest.contestName,
      refCode: contest.refCode,
      questions: sanitizedQuestions,
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching contest:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function submitContest(req, res) {
  try {
    const db = getDB();
    const contestCode = req.params.code;
    const uid = req.user.uid;

    const existing = await db.collection('contestSubmissions').findOne({ uid, refCode: contestCode });
    if (existing) return res.status(403).json({ message: 'Already attempted' });

    const teacherData = await db.collection('createContest').findOne({ 'contests.refCode': contestCode });
    if (!teacherData) return res.status(404).json({ message: 'Contest not found' });

    const contest = teacherData.contests.find((c) => c.refCode === contestCode);
    if (!contest) return res.status(404).json({ message: 'Contest not found in teacher record' });

    const submittedAnswers = req.body.answers;
    const score = req.body.score;
    const total = contest.questions.length;

    const formattedAnswers = contest.questions.map((q) => {
      const selected = submittedAnswers[q.qstnText];
      return {
        qstnText: q.qstnText,
        imgUrl: q.imgUrl || '',
        correctOption: q.options.find((o) => o.isCorrect)?.optionText || '',
        selectedOption: selected?.optionText || null,
        isCorrect: selected?.isCorrect || false,
      };
    });

    await db.collection('contestSubmissions').insertOne({
      uid,
      refCode: contestCode,
      contestName: contest.contestName || 'Untitled Contest',
      score,
      total,
      answers: formattedAnswers,
      submittedAt: new Date(),
    });

    res.json({ message: 'Submission recorded' });
  } catch (err) {
    console.error('Error submitting contest:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAttemptedContests(req, res) {
  try {
    const db = getDB();
    const uid = req.user.uid;
    const submissions = await db
      .collection('contestSubmissions')
      .find({ uid })
      .project({ _id: 0, refCode: 1, contestName: 1, score: 1, total: 1, submittedAt: 1 })
      .sort({ submittedAt: -1 })
      .toArray();

    res.json(submissions);
  } catch (err) {
    console.error('Error fetching attempted contests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function viewContestSolution(req, res) {
  try {
    const db = getDB();
    const studentId = req.user.uid;
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

async function getQuizAttempt(req, res) {
  try {
    const db = getDB();
    const { subject, chapters, count } = req.query;
    const uid = req.user.uid;
    if (!subject || !chapters || !count) {
      return res.status(400).json({ error: 'Missing query parameters' });
    }
    const chapterList = chapters.split(',');
    const numQuestions = parseInt(count, 10);

    const subjectDoc = await db.collection('generalQuestions').findOne({ subject });

    if (!subjectDoc) return res.status(404).json({ error: 'Subject not found' });

    const filtered = subjectDoc.Questions.filter((q) => chapterList.includes(q.Chapter));

    const shuffled = shuffleArray(filtered);
    const selected = shuffled.slice(0, numQuestions);

    const attempt = {
      studentId: uid,
      subject,
      chapterList,
      generateAt: new Date(),
      status: 'incomplete',
      questions: selected,
      studentAnswers: {},
      score: 0,
    };

    const result = await db.collection('quizGenerated').insertOne(attempt);
    res.json({ quizId: result.insertedId, questions: selected });
  } catch (err) {
    console.error('Error in /quizAttempt:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function submitQuiz(req, res) {
  try {
    const db = getDB();
    const { quizId, answers, sc } = req.body;
    const uid = req.user.uid;

    if (!quizId || !answers || typeof sc !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid data' });
    }

    if (!ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: 'Invalid quiz ID format' });
    }

    const quizDoc = await db.collection('quizGenerated').findOne({ _id: new ObjectId(quizId) });
    if (!quizDoc) return res.status(404).json({ error: 'Quiz not found' });

    if (quizDoc.studentId !== uid) return res.status(403).json({ error: 'Unauthorized' });
    if (quizDoc.status === 'complete') return res.status(409).json({ error: 'Quiz already submitted' });

    await db.collection('quizGenerated').updateOne(
      { _id: new ObjectId(quizId) },
      {
        $set: {
          studentAnswers: answers,
          score: sc,
          status: 'complete',
          submittedAt: new Date(),
        },
      }
    );

    res.json({ message: 'Quiz submitted successfully' });
  } catch (err) {
    console.error('Error in /submitQuiz:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function quizHistory(req, res) {
  try {
    const db = getDB();
    const uid = req.user.uid;
    const attempts = await db
      .collection('quizGenerated')
      .find({ studentId: uid })
      .sort({ generateAt: -1 })
      .project({ subject: 1, chapterList: 1, generateAt: 1, status: 1, score: 1, questions: 1 })
      .toArray();
    res.json(attempts);
  } catch (error) {
    console.error('Error in /quizHistory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function viewQuizSolution(req, res) {
  try {
    const db = getDB();
    const { quizId } = req.params;
    const uid = req.user.uid;

    if (!ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: 'Invalid quiz ID format' });
    }

    const attempt = await db.collection('quizGenerated').findOne({ _id: new ObjectId(quizId) });

    if (!attempt) return res.status(404).json({ error: 'Quiz attempt not found' });

    if (!attempt.studentAnswers) attempt.studentAnswers = {};
    if (attempt.score === undefined) attempt.score = 0;

    res.json(attempt);
  } catch (err) {
    console.error('Error in /view-quiz-solution:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getContestForStudent,
  submitContest,
  getAttemptedContests,
  viewContestSolution,
  getQuizAttempt,
  submitQuiz,
  quizHistory,
  viewQuizSolution,
};
