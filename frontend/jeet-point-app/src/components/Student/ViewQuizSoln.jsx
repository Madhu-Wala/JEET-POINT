import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function ViewQuizSoln() {
  const { _id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const user = getAuth().currentUser;
        const token = await user.getIdToken();
        const res = await axios.get(
          `https://jeet-point-backend.onrender.com/student/view-quiz-solution/${_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuiz(res.data);
      } catch (err) {
        console.error("Error fetching solution:", err);
      }
    };
    fetchSolution();
  }, [_id]);

  if (!quiz) return <p className="text-center">Loading...</p>;

  const parseMath = (input) => {
    const parts = input.split(/(\$[^$]+\$)/g);
    return parts.map((part, idx) =>
      part.startsWith("$") && part.endsWith("$") ? (
        <InlineMath key={idx} math={part.slice(1, -1)} />
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">📘 Quiz Solution</h1>
      <p className="text-center mb-4 text-gray-600">
        Score: <span className="font-bold">{quiz.score}/{quiz.questions.length}</span>
      </p>

      {quiz.questions.map((q, idx) => {
        const studentAnswer = quiz.studentAnswers[q.qstnText];
        const correctOption = q.options.find((o) => o.isCorrect).optionText;

        return (
          <div
            key={idx}
            className="p-4 mb-4 border rounded-lg bg-white shadow-md flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <p className="font-semibold mb-2">{idx + 1}. {parseMath(q.qstnText)}</p>

              {q.options.map((opt, i) => {
                const isChosen = studentAnswer === opt.optionText;
                const isRight = opt.isCorrect;

                return (
                  <div
                    key={i}
                    className={`p-2 rounded-md mb-1 ${
                      isRight
                        ? "bg-green-200"
                        : isChosen
                        ? "bg-red-200"
                        : "bg-gray-100"
                    }`}
                  >
                    {parseMath(opt.optionText)}
                    {isRight && " ✅"}
                    {isChosen && !isRight && " ❌"}
                  </div>
                );
              })}
            </div>

            {q.imgUrl && (
              <img
                src={q.imgUrl}
                alt="Question"
                className="w-full md:w-64 h-auto rounded-lg border shadow-sm"
              />
            )}
          </div>
        );
      })}
      <button
        onClick={() => navigate(`/StudentDASH`)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
