const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken } = require('../middleware/firebaseAuth');

// student: fetch contest by code
router.get('/contest/:code', verifyToken, studentController.getContestForStudent);

// student: submit contest response
router.post('/submit/:code', verifyToken, studentController.submitContest);

// student: attempted contests list
router.get('/attempted-contests', verifyToken, studentController.getAttemptedContests);

// student: view solution for contest
router.get('/view-solution/:code', verifyToken, studentController.viewContestSolution);

// teacher's route 'view-solution' and student 'view-solution' are same endpoint in original file.
// Keeping student route name consistent with provided structure.

// student: generate quiz attempt
router.get('/quizAttempt', verifyToken, studentController.getQuizAttempt);

// student: submit quiz
router.post('/submitQuiz', verifyToken, studentController.submitQuiz);

// student: quiz history
router.get('/quizHistory', verifyToken, studentController.quizHistory);

// student: view quiz solution
router.get('/view-quiz-solution/:quizId', verifyToken, studentController.viewQuizSolution);

module.exports = router;
