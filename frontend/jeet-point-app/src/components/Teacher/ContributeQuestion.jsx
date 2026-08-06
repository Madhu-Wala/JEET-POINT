import { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import API_URL from "../../config/api";


const subjects = ["Physics", "Chemistry", "Biology", "Mathematics"];
const chapters = {
  Physics: ["Electrostatics","Current Electricity","Magnetism","Optics","Thermodynamics","Energy","Gravitation","Motion"],
  Chemistry: ["Atomic Structure","Redox Reactions and Electrochemistry","Periodic Table","Solutions","Coordination Compounds","Chemical Bonding","Organic Chemistry","Polymers"],
  Biology: ["Cell Biology","Reproduction","Biotechnology and its Applications","Genetics","Diversity in Living World","Physiology - Plant and Human","Evolution","Ecology and Environment"],
  Mathematics: ["Algebra","Coordinate Geometry","Matrices and Determinants","Trigonometry","Vector Algebra","Complex Numbers","Calculus","Statistics and Probability"]
};

export default function ContributeQuestion() {
  const [contributed, setContributed] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    chapter: "",
    qstnText: "",
    options: ["", "", "", ""],
    correctIndex: null,
    imgUrl: "",
    date: new Date().toISOString().split("T")[0],
  });

  // 🔹 Fetch contributed questions
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        const response = await axios.get(`${API_URL}/teacher/contributed`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setContributed(response.data.data || []);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchContributions();
  }, []);

  // 🔹 Image upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "jeet_uploads"); // ✅ your preset name
      data.append("cloud_name", "dsivnagyp");       // ✅ your Cloudinary cloud name

      const res = await fetch("https://api.cloudinary.com/v1_1/dsivnagyp/image/upload", {
        method: "POST",
        body: data,
      });

      const uploadResult = await res.json();
      setFormData({ ...formData, imgUrl: uploadResult.secure_url });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Handle option change
  const handleOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData({ ...formData, options: updated });
  };

  // 🔹 Submit new question
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getAuth().currentUser;
      const token = await user.getIdToken();

      const formattedOptions = formData.options.map((opt, i) => ({
        optionText: opt,
        isCorrect: i === formData.correctIndex,
      }));

      const payload = {
        subject: formData.subject,
        chapter: formData.chapter,
        qstnText: formData.qstnText,
        options: formattedOptions,
        imgUrl: formData.imgUrl,
      };

      const response = await axios.post(`${API_URL}/teacher/contribute`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Question submitted successfully!");
      setContributed((prev) => [...prev, payload]);
      setShowForm(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("❌ Error submitting question.");
    }
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // 🔹 UI
  return (
    <div className="p-4 font-notosans relative">
      <h2 className="text-2xl font-bold text-violet-700 mb-6 text-center">
        ✍️ Questions You Contributed
      </h2>

      <div className="text-center mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg font-semibold shadow"
        >
          ➕ Contribute New Question
        </button>
      </div>

      {/* Existing Questions */}
      {contributed.length === 0 ? (
        <p className="text-center text-gray-500">No questions contributed yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {contributed.map((q, index) => (
            <div key={index} className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
              {q.imgUrl && (
                <button
                  type="button"
                  onClick={() => setPreviewUrl(q.imgUrl)}
                  className="block p-0 border-0 bg-transparent rounded overflow-hidden flex-shrink-0"
                >
                  <img
                    src={q.imgUrl}
                    alt="Question"
                    className="w-24 md:w-64 h-24 md:h-auto object-contain rounded-lg border shadow-sm"
                  />
                </button>
              )}
              <div className="min-w-0">
                <div className="text-lg font-semibold text-[#160533] mb-2 break-words whitespace-normal">{q.qstnText}</div>
                <ul className="text-sm list-disc pl-5">
                  {Array.isArray(q.options) &&
                    q.options.map((opt, i) => (
                      <li key={i} className={opt.isCorrect ? "text-green-600 font-bold break-words whitespace-normal" : "break-words whitespace-normal"}>
                        {opt.optionText}
                      </li>
                    ))}
                </ul>
                <div className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Subject:</span> {q.subject} |{" "}
                  <span className="font-semibold">Chapter:</span> {q.Chapter || q.chapter}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Added on: {formatDate(q.createdAt || new Date())}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pop-up Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-10">
          <div className="bg-white rounded-lg p-6 shadow-xl w-[90%] max-w-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold text-violet-700 mb-4 text-center">
              📝 Add New Question
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value, chapter: "" })
                  }
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  <option value="">--Select Subject--</option>
                  {subjects.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Chapter</label>
                <select
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  <option value="">--Select Chapter--</option>
                  {(chapters[formData.subject] || []).map((chap) => (
                    <option key={chap} value={chap}>{chap}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Question Text</label>
                <textarea
                  value={formData.qstnText}
                  onChange={(e) => setFormData({ ...formData, qstnText: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Options</label>
                {formData.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={formData.correctIndex === i}
                      onChange={() => setFormData({ ...formData, correctIndex: i })}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 border rounded px-3 py-2"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Optional Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border rounded px-3 py-2"
                />
                {uploading && <p className="text-xs text-gray-500 mt-1">Uploading image...</p>}
                {formData.imgUrl && (
                  <img src={formData.imgUrl} alt="Preview" className="w-32 mt-2 rounded border" />
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-600 border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
                >
                  {uploading ? "Uploading..." : "Save Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-[90vh]">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1 shadow z-50"
              aria-label="Close preview"
            >
              ✕
            </button>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded"
            />
          </div>
        </div>
      )}

      <p className="text-sm text-center text-gray-500 mt-6">
        © 2025 JEET Point. All rights reserved.
      </p>
    </div>
  );
}
