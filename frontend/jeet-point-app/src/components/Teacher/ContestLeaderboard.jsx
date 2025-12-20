import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import axios from "axios";

export default function ContestLeaderboard() {
  const { code } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [studentNames, setStudentNames] = useState({});
  const navigate = useNavigate();

  const db = getFirestore();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const user = getAuth().currentUser;
        const token = await user.getIdToken();

        // Fetch submissions
        const response = await axios.get(
          `https://jeet-point-backend.onrender.com/teacher/leaderboard/${code}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const submissions = response.data;
        setLeaderboard(submissions);

        // Fetch student names in parallel from Firestore
        const namePromises = submissions.map(async (entry) => {
          const docRef = doc(db, "users", entry.uid);
          const snap = await getDoc(docRef);
          return {
            uid: entry.uid,
            name: snap.exists() ? snap.data().name : "Unknown",
          };
        });

        const nameResults = await Promise.all(namePromises);
        const nameMap = {};
        nameResults.forEach((item) => (nameMap[item.uid] = item.name));
        setStudentNames(nameMap);

      } catch (err) {
        console.error("Error fetching leaderboard", err);
      }
    };

    fetchLeaderboard();
  }, [code, db]);

  return (
    <div className="p-6 font-notosans">
      <h2 className="text-2xl font-bold text-center text-violet-700 mb-6">
        🏆 Contest Leaderboard
      </h2>

      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="min-w-full text-center">
          <thead className="bg-violet-100">
            <tr>
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">Student</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr
                key={index}
                className={`border-t ${
                  index === 0 ? "bg-yellow-50 font-semibold" : ""
                }`}
              >
                <td className="py-2 px-4 text-left">{index + 1}</td>
                <td className="py-2 px-4 text-left">
                  {studentNames[entry.uid] || "Unknown"}
                </td>
                <td className="py-2 px-4">
                  {entry.score}/{entry.total}
                </td>
                <td className="py-2 px-4">
                  {((entry.score / entry.total) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => navigate(`/TeacherDASH/contests`)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
