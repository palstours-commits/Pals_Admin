"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#9333ea",
  "#dc2626",
  "#0d9488",
];

const ReportChart = ({ data = [] }) => {
  const chartData = [];
  const modulesSet = new Set();

  data.forEach((item) => {
    const weekKey = `Week ${item.week}`;
    modulesSet?.add(item.module);
    let row = chartData?.find((d) => d.week === weekKey);
    if (!row) {
      row = { week: weekKey };
      chartData.push(row);
    }

    row[item.module] = item.count;
  });

  const modules = Array.from(modulesSet);
  if (!chartData.length) {
    return (
      <div className="text-center text-gray-400 py-10">
        No chart data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        {modules.map((module, index) => (
          <Bar
            key={module}
            dataKey={module}
            fill={COLORS[index % COLORS.length]}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReportChart;
