import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Signup from './components/Signup';
import StudentLayout from './components/Student/StudentLayout';
import StudentQuiz from './components/Student/StudentQuiz';
import StudentContest from './components/Student/StudentContest';
import StudentAnalytics from './components/Student/StudentAnalytics';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import QuizAttempt from './components/Student/QuizAttempt';
import ViewSolution from './components/Student/ViewSolution';
import ContestAttempt from './components/Student/ContestAttempt';
import TeacherLayout from './components/Teacher/TeacherLayout';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import TeacherContest from './components/Teacher/TeacherContest';
import GenerateContest from './components/Teacher/GenerateContest';
import ContestLeaderboard from './components/Teacher/ContestLeaderboard';
import ContributeQuestion from './components/Teacher/ContributeQuestion';
import ViewResponse from './components/Teacher/ViewResponse';
import ViewSubmissions from './components/Teacher/ViewSubmissions';
import ViewQuizSoln from './components/Student/ViewQuizSoln';

function App() {
    const { loading } = useContext(AuthContext);
    if (loading) return null;

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot" element={<ForgotPassword />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/StudentDASH" element={<StudentLayout />}>
                        <Route index element={<StudentQuiz />} />
                        <Route path="contests" element={<StudentContest />} />
                        <Route path="analytics" element={<StudentAnalytics />} />
                        <Route path="quizattempt" element={<QuizAttempt/>}/>
                        <Route path="view-solution/:code" element={<ViewSolution/>}/>
                        <Route path="view-quiz-solution/:_id" element={<ViewQuizSoln/>}/>
                        <Route path="contest-attempt/:code" element={<ContestAttempt />} />
                    </Route>
                    <Route path="/TeacherDASH" element={<TeacherLayout />}>
                        <Route index element={<TeacherDashboard />} />
                        <Route path="contests" element={<TeacherContest />} />
                        <Route path="generate" element={<GenerateContest />} />
                        <Route path="view-response/:code" element={<ViewResponse/>} />
                        <Route path="view-submission/:code/:studentId" element={<ViewSubmissions/>} />
                        <Route path="contributions" element={<ContributeQuestion/>}/>
                        <Route path="leaderboard/:code" element={<ContestLeaderboard />} />
                    </Route>

                </Routes>
            </BrowserRouter>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                draggable
            />
        </>
    );
}

export default App;
