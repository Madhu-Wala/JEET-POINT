import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import API_URL from "../../config/api";


function StatBox({ title, value, icon }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between hover:scale-105 transition-transform duration-300 w-full sm:w-60 flex-shrink-0">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-[#160533]">{value}</div>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  );
}

export default function StudentContest() {
  const { user } = useContext(AuthContext);
  const [contestCode, setContestCode] = useState("");
  const [StudentContest,setStudentContest]=useState([]);

  useEffect(()=>{
    const fetchContests=async()=>{
      //call backend
      try {
        const user=getAuth().currentUser;
        const token=await user.getIdToken();
  
        const response=await axios.get(`${API_URL}/student/attempted-contests`,{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        });
  
        console.log("Contests found ",response.data);
        setStudentContest(response.data);
  
      } catch (error) {
         console.error("Error fetching contests", error);
      }
    }
    fetchContests();
  },[]);
  const nav=useNavigate();

  //for dynamic totalcontest, avg and best score cards
  const totalcontests=StudentContest.length;
  const avgScore=totalcontests===0?0:Math.round(StudentContest.reduce((sum,contest)=>sum+(contest.score/contest.total) *100,0)/totalcontests);
  const bestScore=totalcontests===0?0:Math.max(...StudentContest.map((contest)=>Math.round((contest.score/contest.total)*100)));


  return (
    <div className="px-4 font-notosans">
      {/* Centered Stats Row */}
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <StatBox title="Total Contests" value={totalcontests} icon="🏁" />
        <StatBox title="Average Score" value={`${avgScore}%`} icon="📊" />
        <StatBox title="Best Score" value={`${bestScore}%`} icon="⭐" />
      </div>

      {/* Join Contest + Image Side by Side */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-10 mb-6">
        {/* Join Contest Box */}
        <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-[50%] h-[250px] flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-4 text-[#160533]">
            🔑 Join a Contest
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <input
              type="text"
              value={contestCode}
              onChange={(e) => setContestCode(e.target.value)}
              placeholder="Enter Contest Code"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2"
            />
            <button
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-200"
              onClick={() => {
                alert(`Starting contest: ${contestCode}`);
                nav(`/StudentDASH/contest-attempt/${contestCode.trim().toUpperCase()}`);

                }}
            >
              Start Contest
            </button>
          </div>
        </div>

        {/* Contest Image */}
        <div className="w-full md:w-[250px] flex justify-center">
          <img
            className="w-90 h-auto object-cover rounded-xl"
            src="/contestimg.png"
            alt="Contest Visual"
          />
        </div>
      </div>

      {/* Past Contests - centered and narrower */}
      <div className="bg-white shadow-lg w-full md:w-[60%] mx-auto rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-4 text-[#160533]">
          📋 Past Contests
        </h2>
        <div className="space-y-4">
          {StudentContest.map((contest, index) => {
  const percentage = Math.round((contest.score / contest.total) * 100);
  return (<div
            key={index}
            className="flex justify-between items-center p-4 bg-violet-50 rounded-xl shadow-sm"
          >
            {/* Left: Contest Name + Date */}
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-[#160533]">
                {contest.contestName}
              </h4>
              <p className="text-sm text-gray-500">
                {new Date(contest.submittedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Middle: View Button */}
            <div className="w-[150px] text-center">
              <button
                className="bg-violet-100 text-violet-700 px-4 py-2 rounded-xl font-semibold hover:bg-violet-200 transition duration-200"
                onClick={() => nav(`/StudentDASH/view-solution/${contest.refCode}`)}
              >
                View Solution
              </button>
            </div>

            {/* Right: Score */}
            <div className="text-right w-[100px]">
              <p className={percentage < 80 ? "text-orange-600 font-bold" : "text-green-600 font-bold"}>
                {percentage}%
              </p>
              <p className="text-sm text-gray-500">
                {contest.score}/{contest.total}
              </p>
            </div>
          </div>
          );
  
          })}
        </div>
      </div>

      {/* Footer */}
      <p className="text-sm text-center text-gray-500 mt-6">
        © 2025 JEET Point. All rights reserved.
      </p>
    </div>
  );
}
