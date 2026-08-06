const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken,verifyRole } = require('../middleware/firebaseAuth');

// student: fetch contest by code
router.get('/contest/:code', verifyToken,verifyRole("Student"), studentController.getContestForStudent);

// student: submit contest response
router.post('/submit/:code', verifyToken,verifyRole("Student"), studentController.submitContest);

// student: attempted contests list
router.get('/attempted-contests', verifyToken,verifyRole("Student"), studentController.getAttemptedContests);

// student: view solution for contest
router.get('/view-solution/:code', verifyToken,verifyRole("Student"), studentController.viewContestSolution);

// teacher's route 'view-solution' and student 'view-solution' are same endpoint in original file.
// Keeping student route name consistent with provided structure.

// student: generate quiz attempt
router.get('/quizAttempt', verifyToken,verifyRole("Student"), studentController.getQuizAttempt);

// student: submit quiz
router.post('/submitQuiz', verifyToken,verifyRole("Student"), studentController.submitQuiz);

// student: quiz history
router.get('/quizHistory', verifyToken,verifyRole("Student"), studentController.quizHistory);

// student: view quiz solution
router.get('/view-quiz-solution/:quizId', verifyToken,verifyRole("Student"), studentController.viewQuizSolution);

module.exports = router;
