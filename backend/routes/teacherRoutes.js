const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { verifyToken,verifyRole } = require('../middleware/firebaseAuth');
const { upload } = require('../middleware/upload');

// Teacher: contribute question (multipart allowed)
router.post('/contribute', verifyToken,verifyRole("Teacher"), upload.single('file'), teacherController.contributeQuestion);

// Teacher: view their contributed questions
router.get('/contributed', verifyToken,verifyRole("Teacher"), teacherController.getContributedQuestions);

// Teacher: create contest
router.post('/create-contest', verifyToken,verifyRole("Teacher"), teacherController.createContest);

// Teacher: list contests
router.get('/contests', verifyToken,verifyRole("Teacher"), teacherController.getContests);

// Teacher dashContest summary
router.get('/dashContest', verifyToken,verifyRole("Teacher"), teacherController.dashContest);

// Teacher: view all responses for a contest
router.get('/view-responses/:code', verifyToken,verifyRole("Teacher"), teacherController.viewResponses);

// Teacher: view single student's response
router.get('/view-response/:code/:studentId', verifyToken,verifyRole("Teacher"), teacherController.viewResponse);

// Teacher: leaderboard for contest
router.get('/leaderboard/:code', verifyToken,verifyRole("Teacher"), teacherController.leaderboard);

module.exports = router;
