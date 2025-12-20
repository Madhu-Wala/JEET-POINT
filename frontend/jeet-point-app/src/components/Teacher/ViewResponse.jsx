import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import axios from "axios";

export default function ViewResponse() {
  const { code } = useParams(); // contest code
  const [responses, setResponses] = useState([]);
  const [studentNames, setStudentNames] = useState({});
  const navigate = useNavigate();

  const db = getFirestore();

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const user = getAuth().currentUser;
        const token = await user.getIdToken();

        const res = await axios.get(`https://jeet-point-backend.onrender.com/teacher/view-responses/${code}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResponses(res.data);

        // Fetch all student names in parallel
        const namePromises = res.data.map(async (resp) => {
          const docRef = doc(db, "users", resp.uid);
          const snap = await getDoc(docRef);
          return { uid: resp.uid, name: snap.exists() ? snap.data().name : "Unknown" };
        });

        const nameResults = await Promise.all(namePromises);
        const nameMap = {};
        nameResults.forEach((item) => (nameMap[item.uid] = item.name));
        setStudentNames(nameMap);

      } catch (err) {
        console.error("Error fetching student responses", err);
      }
    };

    fetchResponses();
  }, [code, db]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#160533]">
        Students Who Attempted
      </h2>

      {responses.length === 0 ? (
        <p className="text-center text-gray-500">No submissions yet.</p>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {responses.map((resp, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-white p-4 shadow-md rounded-xl"
            >
              <div>
                <p className="font-semibold text-[#160533]">
                  Student: {studentNames[resp.uid] || "Loading..."}
                </p>
                <p className="text-sm text-gray-500">
                  Score: {resp.score}/{resp.total}
                </p>
              </div>

              <button
                onClick={() => navigate(`/TeacherDASH/view-submission/${code}/${resp.uid}`)}
                className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
              >
                View Submission
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => navigate(`/TeacherDASH/contests`)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
