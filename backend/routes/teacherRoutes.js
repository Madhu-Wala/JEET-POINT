const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { verifyToken } = require('../middleware/firebaseAuth');
const { upload } = require('../middleware/upload');

// Teacher: contribute question (multipart allowed)
router.post('/contribute', verifyToken, upload.single('file'), teacherController.contributeQuestion);

// Teacher: view their contributed questions
router.get('/contributed', verifyToken, teacherController.getContributedQuestions);

// Teacher: create contest
router.post('/create-contest', verifyToken, teacherController.createContest);

// Teacher: list contests
router.get('/contests', verifyToken, teacherController.getContests);

// Teacher dashContest summary
router.get('/dashContest', verifyToken, teacherController.dashContest);

// Teacher: view all responses for a contest
router.get('/view-responses/:code', verifyToken, teacherController.viewResponses);

// Teacher: view single student's response
router.get('/view-response/:code/:studentId', verifyToken, teacherController.viewResponse);

// Teacher: leaderboard for contest
router.get('/leaderboard/:code', verifyToken, teacherController.leaderboard);

module.exports = router;
