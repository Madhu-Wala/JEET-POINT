import {useState,useRef} from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import API_URL from "../../config/api";

function ContestQstnBox({ qstnText, imgUrl, options, onSelect }) {
  
  const radioRef = useRef([]);

  const clearSelection = () => {
    radioRef.current.forEach((ref) => ref && (ref.checked = false));
    onSelect(null);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-lg font-semibold mb-2 break-words whitespace-normal">{qstnText}</div>
        <div className="pl-0 md:pl-5">
          {options.map((option, index) => (
            <div key={index} className="mb-2 flex items-start gap-2">
              <input
                type="radio"
                id={`option-${index}`}
                name={`quiz-${index}-${qstnText}`}
                ref={(el) => (radioRef.current[index] = el)}
                onChange={() => onSelect(option)}
                className="mt-1 mr-2 flex-shrink-0"
              />
              <label htmlFor={`option-${index}`} className="break-words whitespace-normal">
                {option.optionText}
              </label>
            </div>
          ))}
        </div>
      </div>
      {imgUrl && (
        <div className="w-full md:w-72 lg:w-80 flex-shrink-0">
          <img
            src={imgUrl}
            alt="Question Illustration"
            className="w-full md:w-72 lg:w-80 h-auto object-contain rounded-lg border shadow-sm max-h-[520px]"
          />
        </div>
      )}
      <div className="w-full md:w-auto">
        <button
          onClick={clearSelection}
          className="w-full md:w-auto bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
}

function ContestAttempt() {
  const { code } = useParams();
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [total,setTotal]=useState(0);


  const [questions,setQuestions]=useState([]);
  const [notFound,setNotFound]=useState(false);
  const nav=useNavigate();

  

  //get call to backend to render test questions
  useEffect(()=>{
    const fetchContest=async()=>{
      try {

        const user=getAuth().currentUser;
        const token=await user.getIdToken();
        
        const response=await axios.get(`${API_URL}/student/contest/${code}`,{
        headers:{
          Authorization:`Bearer ${token}`
        },
      });
       
        setQuestions(response.data.questions);
      } catch (err) {
        console.error("Error fetching contest:", err);
        if (err.response?.status === 403) {
          alert("❌ You have already attempted this contest.");
          nav("/StudentDASH/contests");
        } else {
          setNotFound(true);
        }
      }
    };

    fetchContest();
  },[code]);

  const handleSelect = (qstnText, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [qstnText]: selectedOption,
    }));
  };

  const handleSubmit = async() => {
    let sc = 0,totalScore=0;
    questions.forEach((q) => {
      const selected = answers[q.qstnText];
      totalScore++;
      if (selected && selected.isCorrect) {
        sc++;
      }
    });
    setScore(sc);
    setTotal(totalScore);
    setSubmitted(true);

    try {
      const user=getAuth().currentUser;
      const token=await user.getIdToken();

      const sendResponse={
        score:sc,total:total,answers:answers
      }

    const response= await axios.post(`${API_URL}/student/submit/${code}`,sendResponse,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      alert("Submission successful",response.data);

    } catch (err) {
      console.log("error submitting contest",err);
      alert("Submission failed, try again");
    }

  };

  return (
    <div className="p-4 font-notosans">
      <h2 className="text-2xl font-bold mb-4 text-center text-violet-700">
        Contest Code: {code}
      </h2>

      {questions.length === 0 ? (
        <p className="text-center text-red-600 font-medium">❌ Invalid or unavailable contest code.</p>
      ) : (
        <>
          {questions.map((qstn, index) => (
            <ContestQstnBox
              key={index}
              qstnText={qstn.qstnText}
              imgUrl={qstn.imgUrl}
              options={qstn.options}
              onSelect={(opt) => handleSelect(qstn.qstnText, opt)}
            />
          ))}

          <div className="text-center mt-6">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold w-full md:w-auto"
              >
                Submit Contest
              </button>
            ) : (
               <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
                  <h2 className="text-xl font-semibold mb-4 text-green-600">
                    🎉 Submission Successful
                  </h2>
                  <p className="text-lg font-bold mb-2">You scored {score} out of {total}</p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      nav("/StudentDASH/contests");
                    }}
                    className="mt-4 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ContestAttempt;