import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

export default function QuizAttempt() {
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const fetchedRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  // query params
  const searchParams = new URLSearchParams(location.search);
  const subject = searchParams.get("subject");
  const chaptersParam = searchParams.get("chapters");
  const count = searchParams.get("count") || 5;

  // fetch quiz
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchQuiz = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        const response = await axios.get(
          `https://jeet-point-backend.onrender.com/student/quizAttempt?subject=${encodeURIComponent(
            subject
          )}&chapters=${encodeURIComponent(chaptersParam)}&count=${count}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setQuestions(response.data.questions || []);
        setQuizId(response.data.quizId || null);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [subject, chaptersParam, count]);

  const handleSelect = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    try {
      let sc = 0;
      questions.forEach((q) => {
        const selected = answers[q.qstnText];
        const correct = q.options.find((opt) => opt.isCorrect);
        if (selected && correct?.optionText === selected) sc++;
      });

      const user = getAuth().currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      await axios.post(
        `https://jeet-point-backend.onrender.com/student/submitQuiz`,
        { quizId, answers, sc },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScore(sc);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (!questions.length && !submitted)
    return <p className="text-center mt-8 text-gray-600">Loading quiz...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h2 className="text-3xl font-semibold text-center mb-6 text-blue-700">
        {subject} Quiz
      </h2>

      {!submitted ? (
        <>
          <div className="max-w-4xl mx-auto space-y-10">
            {questions.map((qstn, index) => (
              <QstnBox
                key={index}
                indexKey={index}
                qstnText={qstn.qstnText}
                imgUrl={qstn.imgUrl}
                options={qstn.options}
                selected={answers[qstn.qstnText]}
                onSelect={(opt) => handleSelect(qstn.qstnText, opt)}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Submit Quiz
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-10">
          <h3 className="text-2xl font-bold text-green-600">
            🎉 Quiz Submitted Successfully!
          </h3>
          <p className="text-lg mt-2 text-gray-700">
            Your Score: {score} / {questions.length}
          </p>
          <button
            onClick={() => navigate("/StudentDASH")}
            className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

function parseMathString(text) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      const latex = part.slice(1, -1);
      // wrap InlineMath in a scrollable inline-block to avoid overflow on small screens
      return (
        <span key={idx} className="inline-block max-w-full overflow-x-auto">
          <InlineMath math={latex} />
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function QstnBox({ indexKey, qstnText, imgUrl, options, selected, onSelect }) {
  return (
    <div className="bg-white p-6 shadow-md rounded-xl border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        <span className="inline-block mr-2">{indexKey + 1}.</span>
        <span className="break-words whitespace-normal">{parseMathString(qstnText)}</span>
      </h3>

      {imgUrl && (
        <div className="flex justify-center mb-4">
          <img
            src={imgUrl}
            alt="Question Illustration"
            className="rounded-lg max-h-auto object-contain border"
          />
        </div>
      )}

      <div className="space-y-2">
        {options.map((opt, i) => (
          <label
            key={i}
            htmlFor={`option-${indexKey}-${i}`}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="radio"
              id={`option-${indexKey}-${i}`}
              name={`quiz-${indexKey}`}
              value={opt.optionText || opt}
              checked={selected === (opt.optionText || opt)}
              onChange={() => onSelect(opt.optionText || opt)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 break-words whitespace-normal max-w-full block">
              {parseMathString(opt.optionText ? opt.optionText : opt)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
