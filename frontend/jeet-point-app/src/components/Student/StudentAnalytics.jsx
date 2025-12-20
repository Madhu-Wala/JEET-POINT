import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { getAuth } from "firebase/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function StudentAnalytics() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [studentContest, setStudentContest] = useState([]);

  // ---- Fetch Quiz History ----
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = getAuth().currentUser;
        const token = await user.getIdToken();
        const response = await axios.get(
          "https://jeet-point-backend.onrender.com/student/quizHistory",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(response.data);
      } catch (err) {
        console.error("Error fetching quiz history:", err);
      }
    };
    fetchHistory();
  }, []);

  // ---- Fetch Contests ----
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const user = getAuth().currentUser;
        const token = await user.getIdToken();

        const response = await axios.get(
          "https://jeet-point-backend.onrender.com/student/attempted-contests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Contests found ", response.data);
        setStudentContest(response.data);
      } catch (error) {
        console.error("Error fetching contests", error);
      }
    };
    fetchContests();
  }, []);

  // ---- Prepare Score Trend Data ----
  const scoreData = history
    .filter((q) => q.status === "complete")
    .map((q) => ({
      date: new Date(q.generateAt).toLocaleDateString(),
      score: ((q.score / q.questions.length) * 100).toFixed(1),
    }));

  // ---- Subject-wise Stats ----
  const subjectStats = (() => {
    const grouped = {};
    history.forEach((q) => {
      if (q.status === "complete") {
        if (!grouped[q.subject]) grouped[q.subject] = [];
        grouped[q.subject].push((q.score / q.questions.length) * 100);
      }
    });

    return Object.keys(grouped).map((subject) => ({
      subject,
      avg: (
        grouped[subject].reduce((a, b) => a + b, 0) / grouped[subject].length
      ).toFixed(1),
    }));
  })();

  // ---- Pie Chart Data ----
  const totalQuizzes = history.length;
  const completed = history.filter((q) => q.status === "complete").length;
  const accuracyData = [
    { name: "Completed", value: completed },
    { name: "Incomplete", value: totalQuizzes - completed },
  ];
  const COLORS = ["#16A34A", "#EF4444"];

  // ---- Heatmap Data ----
  const dateCounts = {};
  history.forEach((q) => {
    const date = new Date(q.generateAt).toISOString().split("T")[0];
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });
  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);

  const heatmapValues = Object.keys(dateCounts).map((date) => ({
    date,
    count: dateCounts[date],
  }));

  // ---- Render ----
  return (
    <div className="p-6 font-notosans space-y-6">
      <h1 className="text-3xl font-bold text-[#160533] mb-6">
        Analytics Dashboard 📊
      </h1>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white shadow-lg p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Score Progress Over Time</h2>
          {scoreData.length === 0 ? (
            <p className="text-gray-500 text-center">No quiz data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={scoreData}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Quiz Completion</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={accuracyData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {accuracyData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Grid + Calendar */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Subject Performance - narrower */}
        <div className="bg-white shadow-lg p-4 rounded-xl w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Subject-wise Performance</h2>
          {subjectStats.length === 0 ? (
            <p className="text-gray-500 text-center">No completed quizzes.</p>
          ) : (
            <div className="space-y-3">
              {subjectStats.map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b pb-2 text-lg"
                >
                  <span>{s.subject}</span>
                  <span className="font-semibold text-[#160533]">
                    {s.avg}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar Heatmap */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 bg-white shadow-lg p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Days Active</h2>
          <div className="overflow-x-auto">
            <CalendarHeatmap
              startDate={startDate}
              endDate={today}
              values={heatmapValues}
              classForValue={(value) => {
                if (!value) return "color-empty";
                if (value.count >= 3) return "color-scale-4";
                if (value.count === 2) return "color-scale-3";
                if (value.count === 1) return "color-scale-2";
                return "color-scale-1";
              }}
              showWeekdayLabels={false}
            />
          </div>
          <div className="mt-4 flex gap-4 text-xs text-gray-500">
              <span>
                <span className="inline-block w-3 h-3 bg-gray-100 mr-2"></span>
                No activity
              </span>
              <span>
                <span className="inline-block w-3 h-3 bg-green-200 mr-2"></span>
                Low
              </span>
              <span>
                <span className="inline-block w-3 h-3 bg-green-400 mr-2"></span>
                Medium
              </span>
              <span>
                <span className="inline-block w-3 h-3 bg-green-700 mr-2"></span>
                High
              </span>
            </div>
        </div>
      </div>

      {/* Contest Results */}
      <div className="bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🏆 Contest Results</h2>
        {studentContest.length === 0 ? (
          <p className="text-gray-500 text-center">No contests attempted yet.</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {studentContest.map((contest, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-violet-50 p-4 rounded-lg shadow-sm gap-3"
              >
                {/* Left side */}
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg text-[#160533]">
                    {contest.contestName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Code: {contest.refCode} •{" "}
                    {contest.submittedAt
                      ? new Date(contest.submittedAt).toLocaleDateString()
                      : "Unknown Date"}
                  </p>
                </div>

                {/* Right side */}
                <div className="text-right w-full md:w-auto">
                  <p className="font-bold text-green-600">
                    {contest.total
                      ? `${((contest.score / contest.total) * 100).toFixed(1)}%`
                      : `${contest.score}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {contest.score}/{contest.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
