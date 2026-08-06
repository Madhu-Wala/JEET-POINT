import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import API_URL from "../../config/api";


function StatBox({ title, value, icon }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between hover:scale-105 transition-transform duration-300 w-60">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-[#160533]">{value}</div>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  );
}

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [contestsRaw, setContestsRaw] = useState([]);
  const [dashContests, setDashContests] = useState([]);
  const [contributionsRaw, setContributionsRaw] = useState([]);

  const [subjectCounts, setSubjectCounts] = useState([]);
  const [heatmapValues, setHeatmapValues] = useState([]);
  const [avgContestScore, setAvgContestScore] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const user = getAuth().currentUser;
        if (!user) throw new Error("User not authenticated");
        const token = await user.getIdToken();

        const [contestsResp, dashResp, contribResp] = await Promise.all([
          axios.get(`${API_URL}/teacher/contests`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/teacher/dashContest`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/teacher/contributed`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const contests = contestsResp?.data?.contests || [];
        const dash = dashResp?.data?.contests || [];
        const contrib = contribResp?.data?.data || [];

        setContestsRaw(contests);
        setDashContests(dash);
        setContributionsRaw(contrib);

        // Subject counts
        const subjMap = {};
        contrib.forEach((item) => {
          const subj = item.subject || "Unknown";
          subjMap[subj] = (subjMap[subj] || 0) + 1;
        });
        const subjArr = Object.keys(subjMap).map((s) => ({
          subject: s,
          count: subjMap[s],
        }));
        setSubjectCounts(subjArr);

        // Heatmap (combine contests + contributions)
        const dateMap = {};
        contests.forEach((c) => {
          if (!c.createdAt) return;
          const d = new Date(c.createdAt).toISOString().split("T")[0];
          dateMap[d] = (dateMap[d] || 0) + 1;
        });
        contrib.forEach((q) => {
          if (!q.createdAt) return;
          const d = new Date(q.createdAt).toISOString().split("T")[0];
          dateMap[d] = (dateMap[d] || 0) + 1;
        });
        const heatArr = Object.keys(dateMap).map((date) => ({
          date,
          count: dateMap[date],
        }));
        setHeatmapValues(heatArr);

        // Avg contest score
        if (dash.length > 0) {
          const avg =
            dash.reduce((sum, c) => sum + (c.avgScore || 0), 0) / dash.length;
          setAvgContestScore(avg.toFixed(1));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);
  const barColors = ["#7c3aed", "#06b6d4", "#16a34a", "#f59e0b", "#ef4444"];
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="p-6 font-notosans">
      <h1 className="text-3xl font-bold text-[#160533] mb-6">
        Teacher Analytics Dashboard 📊
      </h1>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : (
        <div className="space-y-8">
          {/* ---------- Top Stats ---------- */}
          <div className="flex flex-wrap justify-center gap-6">
            <StatBox
              title="Total Contests Created"
              value={contestsRaw.length}
              icon="📚"
            />
            <StatBox
              title="Total Questions Contributed"
              value={contributionsRaw.length}
              icon="✍️"
            />
            <StatBox
              title="Average Contest Score"
              value={`${avgContestScore}%`}
              icon="📈"
            />
          </div>

          {/* ---------- Bar Chart + Contests ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#160533]">
                📚 Questions Contributed (by Subject)
              </h3>
              {subjectCounts.length === 0 ? (
                <p className="text-gray-500">No contributions yet.</p>
              ) : (
                <div style={{ width: "100%", height: 300 }} className="overflow-x-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subjectCounts}
                      layout="vertical"
                      margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                    >
                      <XAxis type="number" />
                      <YAxis
                        type="category"
                        dataKey="subject"
                        width={isNarrow ? 110 : 150}
                        interval={0}
                      />
                      <ReTooltip />
                      <Bar dataKey="count" barSize={isNarrow ? 14 : 20}>
                        {subjectCounts.map((_, i) => (
                          <Cell
                            key={i}
                            fill={barColors[i % barColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Contests List */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#160533]">
                📝 Your Contests
              </h3>
              {dashContests.length === 0 ? (
                <p className="text-gray-500">No contests found.</p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {dashContests.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-violet-50 shadow-sm flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-semibold text-[#160533]">
                          {c.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {c.created} •{" "}
                          {contestsRaw.find(
                            (cc) => cc.contestName === c.title
                          )?.refCode || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            c.avgScore < 75
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {c.avgScore ?? 0}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {c.submissions ?? 0} submissions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* ---------- Wide Calendar Heatmap ---------- */}
          <div className="bg-white rounded-xl shadow-lg p-10">
            <h2 className="text-2xl font-semibold text-[#160533] mb-2">
              📅 Activity Calendar
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Green squares show days you created contests or contributed
              questions.
            </p>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <CalendarHeatmap
                  startDate={startDate}
                  endDate={today}
                  values={heatmapValues}
                  classForValue={(value) => {
                    if (!value) return "color-empty";
                    if (value.count >= 4) return "color-scale-4";
                    if (value.count === 3) return "color-scale-3";
                    if (value.count === 2) return "color-scale-2";
                    return "color-scale-1";
                  }}
                  showWeekdayLabels={false}
                  tooltipDataAttrs={(value) => ({
                    "data-tip": `${value.date}: ${value.count} event${
                      value.count > 1 ? "s" : ""
                    }`,
                  })}
                />
              </div>
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


          <p className="text-center text-gray-400 text-sm mt-6">
            © 2025 JEET | Teacher Analytics
          </p>
        </div>
      )}
    </div>
  );
}
