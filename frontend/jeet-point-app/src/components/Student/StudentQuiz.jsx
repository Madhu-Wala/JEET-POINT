import { useContext } from "react";
import { useState,useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import GenerateQuizModal from "./GenerateQuizModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import API_URL from "../../config/api";


  
function SubBox({ icon, subjectname, no_ofQuizzes, accuracy, color }) {
  const bgColor = {
    blue: "bg-blue-200 text-blue-600",
    green: "bg-green-200 text-green-600",
    purple: "bg-purple-200 text-purple-600",
    orange: "bg-orange-200 text-orange-600",
  };

  return (
    <div className="flex flex-col justify-center w-full items-center m-1 sm:m-2 p-2 sm:p-3 min-w-0">
      <div className={`text-3xl md:text-5xl p-2 sm:p-3 rounded-4xl ${bgColor[color]}`}>
        {icon}
      </div>
      <div className={`text-sm md:text-lg font-bold ${bgColor[color].split(" ")[1]}`}>{subjectname}</div>
      <div className="text-xs md:text-sm text-gray-500">{no_ofQuizzes}</div>
      <div className={`text-xs md:text-sm ${bgColor[color].split(" ")[1]}`}>{accuracy}</div>
    </div>
  );

}


export default function StudentQuiz() {
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [history, setHistory] = useState([]);
  
  const nav = useNavigate();

  useEffect( () => {
    const fetchHistory=async()=>{
      try {
        const user=getAuth().currentUser;
        const token=await user.getIdToken();
        const response=await axios.get(`${API_URL}/student/quizHistory`, {headers: {Authorization: `Bearer ${token}`}});
        setHistory(response.data);
      } catch (err) {
        console.error("Error fetching quiz history:", err);
      }
    };
    fetchHistory();
  },[]);

// derive subject-wise stats dynamically
const subjectsData = (() => {
  if (history.length === 0) return [];

  // group quizzes by subject
  const grouped = history.reduce((acc, q) => {
    if (!acc[q.subject]) acc[q.subject] = [];
    acc[q.subject].push(q);
    return acc;
  }, {});

  // assign an icon & color for each subject
  const subjectIcons = {
    Physics: { icon: "💡", color: "blue" },
    Chemistry: { icon: "🧪", color: "green" },
    Biology: { icon: "🌱", color: "purple" },
    Mathematics: { icon: "➗", color: "orange" },
  };

  // compute stats for each subject
  return Object.keys(grouped).map((subject) => {
    const quizzes = grouped[subject].filter((q) => q.status === "complete");
    const total = quizzes.length;
    const avgScore =
      total > 0
        ? (
            quizzes.reduce(
              (sum, q) => sum + (q.score / q.questions.length) * 100,
              0
            ) / total
          ).toFixed(1)
        : 0;

    return {
      subject,
      no_ofQuizzes: total,
      accuracy: `${avgScore}%`,
      icon: subjectIcons[subject]?.icon || "📘",
      color: subjectIcons[subject]?.color || "blue",
    };
  });
})();

  function StatBox({ title, value, icon }) {
  return (
    <div className="bg-white font-notosans shadow-md rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 w-full min-w-0">

      <div className="text-sm sm:text-lg text-gray-500">{title}</div>
      <div className="text-xl sm:text-2xl font-bold text-[#160533] mt-1">{value}</div>
      
      <div className="text-3xl sm:text-5xl mt-2">{icon}</div>
    </div>
  );
}


  return (
    <div className="px-3 sm:px-4 font-notosans">{/*Part below navbar*/}

      <div className="flex flex-col sm:flex-row items-stretch gap-6 text-center">
        {/* Stat boxes (responsive) */}
              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <StatBox title="Total Quizzes" value={history.length} icon="📅" /> 

          <StatBox
            title="Average Score"
            value={
              history.length > 0
                ? `${(
                    history
                      .filter((q) => q.status === "complete")
                      .reduce((sum, q) => sum + (q.score / q.questions.length) * 100, 0) /
                    history.filter((q) => q.status === "complete").length
                  ).toFixed(1)}%`
                : "—"
            }
            icon="🏆"
          />

          <StatBox
            title="Best Score"
            value={
              history.length > 0
                ? `${Math.max(
                    ...history
                      .filter((q) => q.status === "complete")
                      .map((q) => (q.score / q.questions.length) * 100)
                  ).toFixed(1)}%`
                : "—"
            }
            icon="⭐"
          />
        </div>

        {/* Dashboard image (hidden on xs) */}
        <div className="flex justify-center">
          <img
            className="hidden sm:block w-48 md:w-64 h-auto object-contain"
            src="/stuQuizpage.png"
            alt="Dashboard Illustration"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Subject Performance */}
        <div className="w-full md:flex-[3] self-start shadow-lg bg-white rounded-2xl p-4 md:p-6 min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold text-center mb-4 text-[#160533]">📊 Subject Performance</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjectsData.length === 0 ? (
              <p className="text-center text-gray-500">No quiz data available yet.</p>
            ) : (
              subjectsData.map((subject, index) => (
                <SubBox
                  key={index}
                  icon={subject.icon}
                  subjectname={subject.subject}
                  no_ofQuizzes={subject.no_ofQuizzes}
                  accuracy={subject.accuracy}
                  color={subject.color}
                />
              ))
            )}

          </div>
        </div>

        {/* Recent Quiz Results */}
      <div className="w-full md:flex-[4] self-start shadow-lg bg-white rounded-2xl p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold text-center text-[#160533] mb-4">📝 Recent Quiz Results</h1>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-violet-400 scrollbar-track-violet-100">
    {history.length === 0 ? (
      <p className="text-center text-gray-500">No quizzes attempted yet.</p>
    ) : (
      history.map((quiz) => {
        const isIncomplete = quiz.status === "incomplete";
        const percent = quiz.questions && quiz.questions.length
          ? (quiz.score / quiz.questions.length) * 100
          : 0;

        return (
          <div
            key={quiz._id}
            className={`flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-4 rounded-xl shadow-sm transition 
        ${isIncomplete ? "bg-gray-100 opacity-70" : "bg-violet-50 hover:shadow-md"}`}
          >
      {/* Left side */}
      <div className="flex-1 min-w-0"> {/* min-w-0 enables truncation inside flex */}
        <h4
          className={`font-semibold text-lg truncate ${
            isIncomplete ? "text-gray-500" : "text-[#160533]"
          }`}
        >
          {quiz.subject} Quiz
        </h4>
        <p className="text-sm text-gray-500 break-words">
          Chapters: {quiz.chapterList.join(", ")} • {new Date(quiz.generateAt).toLocaleDateString()}
        </p>
      </div>

      {/* Middle */}
      <div className="w-full sm:w-[140px] text-center mt-3 sm:mt-0 flex-shrink-0">
        <button
          className={`w-full px-4 py-2 rounded-xl font-medium transition duration-200 ${
            isIncomplete
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-violet-600 text-white hover:bg-violet-700"
          }`}
          onClick={() =>
            !isIncomplete &&
            nav(`/StudentDASH/view-quiz-solution/${quiz._id}`)
          }
          disabled={isIncomplete}
        >
          {isIncomplete ? "Incomplete" : "View Solution"}
        </button>
      </div>

            {/* Right */}
            <div className="text-right w-full sm:w-[100px] mt-3 sm:mt-0 flex-shrink-0">
              {isIncomplete ? (
                <p className="text-red-600 font-bold">Not Attempted</p>
              ) : (
                <>
                  <p
                    className={`font-bold ${
                      percent < 50
                        ? "text-red-600"
                        : percent < 80
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {percent.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {quiz.score}/{quiz.questions.length}
                  </p>
                </>
              )}
            </div>
    </div>
  );
})

    )}
  </div>
</div>


        {/* Start New Quiz */}
          <div className="w-full md:flex-[2] self-start shadow-lg bg-white rounded-2xl p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 text-[#160533]">🚀 Start a New Quiz</h2>
          <div className="flex flex-col gap-3">
            <button className="py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow font-semibold"
            onClick={()=>{
              setSelectedSubject("Physics");
              setIsModalOpen(true);
            }}>Physics</button>
            <button className="py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow font-semibold"
             onClick={()=>{
              setSelectedSubject("Chemistry");
              setIsModalOpen(true);
            }}>Chemistry</button>
            <button className="py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow font-semibold"
             onClick={()=>{
              setSelectedSubject("Mathematics");
              setIsModalOpen(true);
            }}>Mathematics</button>
            <button className="py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow font-semibold"
             onClick={()=>{
              setSelectedSubject("Biology");
              setIsModalOpen(true);
            }}>Biology</button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        
        <p className="text-sm text-center text-gray-500">© 2025 JEET Point. All rights reserved.</p>
      </div>
      {isModalOpen && (
        <GenerateQuizModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subject={selectedSubject}
      />
      )}
    </div>
  );
}

