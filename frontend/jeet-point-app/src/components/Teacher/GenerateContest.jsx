import { useState, useRef } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";


export default function GenerateContest() {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({
    title: "",
    numQuestions: 1,
  });
  const [questions, setQuestions] = useState([]);
  const nav = useNavigate();


  const fileRefs = useRef([]); //  to reset file input when needed

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCards = () => {
    const initQuestions = Array.from({ length: details.numQuestions }, () => ({
      qstnText: "",
      imgUrl: "",
      options: ["", "", "", ""],
      correctIndex: null,
    }));
    setQuestions(initQuestions);
    setStep(2);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = oIndex;
    setQuestions(updated);
  };

  //  Upload image to Cloudinary
  const handleImageUpload = async (qIndex, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "jeet_uploads");
    formData.append("cloud_name", "dsivnagyp");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dsivnagyp/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      const imageUrl = data.secure_url;

      const updated = [...questions];
      updated[qIndex].imgUrl = imageUrl;
      setQuestions(updated);
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Image upload failed");
    }
  };

  // ✅ Fix: Remove image and reset file input
  const handleRemoveImage = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].imgUrl = "";
    setQuestions(updated);

    // reset file input value manually
    if (fileRefs.current[qIndex]) {
      fileRefs.current[qIndex].value = "";
    }
  };

  const handleGenerate = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) return alert("Please login first.");
      const token = await user.getIdToken();

      const formattedQuestions = questions.map((q) => ({
        qstnText: q.qstnText,
        imgUrl: q.imgUrl,
        options: q.options.map((optText, i) => ({
          optionText: optText,
          isCorrect: q.correctIndex === i,
        })),
      }));

      const payload = {
        contestName: details.title,
        questions: formattedQuestions,
      };

      const response = await axios.post(
        "http://localhost:3000/teacher/create-contest",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`✅ Contest Generated Successfully!\nCode: ${response.data.refCode}`);
      nav("/TeacherDASH/contests");
    } catch (err) {
      console.error("Error creating contest:", err.response?.data || err.message);
      alert("Failed to create contest");
    }
  };

  return (
    <div className="p-6 font-notosans max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-violet-700 mb-6">
        🛠️ Generate New Contest
      </h2>

      {step === 1 && (
        <div className="space-y-4 bg-white shadow-md rounded-xl p-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Test Title</label>
            <input
              name="title"
              value={details.title}
              onChange={handleDetailsChange}
              placeholder="Eg: NEET Chapterwise Test"
              className="border px-4 py-2 w-full rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Number of Questions
            </label>
            <input
              type="number"
              name="numQuestions"
              value={details.numQuestions}
              onChange={handleDetailsChange}
              min="1"
              max="50"
              className="border px-4 py-2 w-full rounded-lg"
              required
            />
          </div>

          <button
            onClick={handleCreateCards}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded-lg w-full"
          >
            Next: Add Questions
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-xl font-bold text-violet-800 mb-4">
            📝 Fill in the {questions.length} questions
          </h3>

          <div className="space-y-8">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-white shadow-lg rounded-xl p-4">
                <h4 className="font-semibold mb-2">Question {idx + 1}</h4>

                <textarea
                  value={q.qstnText}
                  onChange={(e) =>
                    handleQuestionChange(idx, "qstnText", e.target.value)
                  }
                  placeholder="Enter question text"
                  className="w-full border px-4 py-2 mb-2 rounded-lg"
                  rows={2}
                  required
                />

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
  {/* Upload Image */}
  <input
    type="file"
    accept="image/*"
    ref={(el) => (fileRefs.current[idx] = el)}
    onChange={(e) => handleImageUpload(idx, e.target.files[0])}
    className="border px-3 py-2 rounded-lg w-full sm:w-auto"
    disabled={q.imgUrl !== ""}
  />

  {/* Remove Button */}
  {q.imgUrl && (
    <button
      onClick={() => handleRemoveImage(idx)}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg w-full sm:w-auto"
    >
      Remove Image
    </button>
  )}
</div>

{/* Image Preview */}
{q.imgUrl && (
  <img
    src={q.imgUrl}
    alt="Uploaded Preview"
    className="w-full sm:w-48 h-32 object-cover rounded-lg mb-3 border"
  />
)}


                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name={`correct-${idx}`}
                      checked={q.correctIndex === oIdx}
                      onChange={() => handleCorrectOption(idx, oIdx)}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(idx, oIdx, e.target.value)
                      }
                      placeholder={`Option ${oIdx + 1}`}
                      className="border px-3 py-1 w-full rounded-lg"
                      required
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 mt-6 rounded-lg w-full"
          >
            ✅ Generate Contest
          </button>
        </div>
      )}
    </div>
  );
}
