import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const stats = [
  { title: "Total Users", value: 10452 },
  { title: "Trips Planned", value: 3289 },
  { title: "Destinations", value: 684 },
  { title: "Daily Visitors", value: 1276 },
];

const Statistics = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* 🏆 Tagline */}
      <div className="text-center mb-12">
     <h1
  className="text-4xl md:text-5xl font-extrabold"
  style={{ color: "#e0e0e0" }} // soft off-white, better contrast
>
  World’s No.1 AI Travel Planner
</h1>


        <p className="text-cyan-200 text-lg mt-3">
          Trusted by thousands for personalized travel experiences
        </p>
      </div>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500 rounded-2xl p-6 text-center shadow-xl hover:shadow-[0_0_20px_#00ffff88] hover:scale-105 transition duration-300"
          >
            <h2 className="text-lg font-semibold text-cyan-300 tracking-wide">{stat.title}</h2>
            <p className="text-4xl font-bold mt-3 text-white">
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* 📈 Enhanced 2D Bar Chart */}
      <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-cyan-300 text-center tracking-wide">
          Monthly User Statistics
        </h2>

        <div className="h-[420px] border border-dashed border-cyan-500 rounded-2xl p-4 bg-black">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00ffff33" />
              <XAxis
                dataKey="title"
                stroke="#0ff"
                tick={{ fill: "#0ff", fontSize: 13, fontWeight: 500 }}
              />
              <YAxis
                stroke="#0ff"
                tick={{ fill: "#0ff", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f0f0f", borderColor: "#0ff" }}
                labelStyle={{ color: "#00ffff", fontWeight: "bold" }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar
                dataKey="value"
                fill="#00ffff"
                radius={[12, 12, 0, 0]}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="#fff"
                  fontSize={12}
                  formatter={(val) => val.toLocaleString()}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
