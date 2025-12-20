import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";

export default function TeacherContest() {
  const navigate = useNavigate();

  const [teacherContests,setTeacherContests]=useState([]);

  useEffect(()=>{
    const fetchContests=async()=>{
      //call backend
      try {
        const user=getAuth().currentUser;
        const token=await user.getIdToken();
  
        const response=await axios.get("http://localhost:3000/teacher/contests",{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        });
  
       
        setTeacherContests(response.data.contests);
  
      } catch (error) {
         console.error("Error fetching contests", error.response?.data || error.message);
      }
    }

    fetchContests();
  },[]);
  

  return (
    <div className="p-4 font-notosans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-violet-700">
          📘 Your Contests
        </h2>
        <button
          onClick={() => navigate("/TeacherDASH/generate")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg"
        >
          ➕ Generate New Contest
        </button>
      </div>

      <div className="space-y-4">
        {teacherContests.map((contest, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white shadow-md rounded-xl p-4"
          >
            {/* Contest Info */}
            <div className="min-w-0">
              <h4 className="text-lg font-semibold text-[#160533] truncate">
                {contest.contestName}
              </h4>
              <p className="text-sm text-gray-500">
                Code: {contest.refCode} • Created: {new Date(contest.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Buttons: stack on small screens, inline on larger screens */}
            <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row items-stretch">
              <button
                onClick={() =>
                  navigate(`/TeacherDASH/view-response/${contest.refCode}`)
                }
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-semibold whitespace-nowrap"
              >
                View Responses
              </button>
              <button
                onClick={() =>
                  navigate(`/TeacherDASH/leaderboard/${contest.refCode}`)
                }
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg font-semibold whitespace-nowrap"
              >
                Leaderboard
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-sm text-center text-gray-500 mt-6">
        © 2025 JEET Point. All rights reserved.
      </p>
    </div>
  );
}
