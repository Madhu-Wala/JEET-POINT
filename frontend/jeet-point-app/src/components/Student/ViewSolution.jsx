import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios";

export default function ViewSolution() {
  const [answers, setAnswers] = useState({});
  const [questions,setQuestions] = useState([]);
  const [contestName,setContestName]=useState("");
  const {code}=useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolution=async()=>{
      try {
        const user=getAuth().currentUser;
      const token=await user.getIdToken();

      const response=await axios.get(`https://jeet-point-backend.onrender.com/student/view-solution/${code}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      setQuestions(response.data.questions);
      setContestName(response.data.contestName);
      const answerMap = {};//new obj to store response answers in a way being used by frontend
      response.data.answers.forEach((a) => {//since it retuens array of objects
        answerMap[a.qstnText] = {
          selectedOption: a.selectedOption,
          correctOption: a.correctOption,
          isCorrect: a.isCorrect,
        };
      });
      setAnswers(answerMap);

      } catch (err) {
        console.log("Error fetching solution")
      }
      
    }
    fetchSolution();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#160533]">View Solution</h2>

      {contestName && (
        <h3 className="text-xl text-center font-semibold text-gray-700 mb-6">
          {contestName}
        </h3>
      )}
      {console.log(questions)}

      {questions.map((q, index) => (
        <div key={index} className="bg-white shadow-md rounded-xl p-4 mb-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{q.qstnText}</h3>
            {q.options.map((opt, idx) => {
          const answer = answers[q.qstnText];
          const selectedOption = answer?.selectedOption;
          const correctOption = answer?.correctOption;

          let style = "border border-gray-300 bg-white";

          if (opt.optionText === correctOption) {
            style = "border-2 border-green-600 bg-green-100";
          }

          if (opt.optionText === selectedOption && selectedOption !== correctOption) {
            style = "border-2 border-red-500 bg-red-100";
          }

          return (
            <div key={idx} className={`p-2 mb-2 rounded ${style}`}>
              {opt.optionText}
            </div>
          );
            })}
          </div>

          {q.imgUrl && (
            <img
              src={q.imgUrl}
              alt="Question"
              className="w-full md:w-64 h-auto mb-2 rounded-lg border shadow-sm object-contain"
            />
          )}

        </div>
      ))}

      <button
        onClick={() => navigate("/StudentDASH/contests")}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
