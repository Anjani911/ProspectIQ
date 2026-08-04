console.log("Dashboard Loaded");
import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardCard from "../components/DashboardCard";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [summaryRes, categoryRes] = await Promise.all([
        api.get("/businesses/dashboard/summary"),
        api.get("/analytics/categories"),
      ]);

      setOverview(summaryRes.data);
      setCategories(categoryRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!overview) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  const websiteData = [
    {
      name: "Has Website",
      value: overview.businesses_with_websites,
    },
    {
      name: "No Website",
      value:
        overview.total_businesses -
        overview.businesses_with_websites,
    },
  ];

  return (
    <div style={{ padding: "30px", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "30px" }}>
        ProspectIQ Dashboard
      </h1>

      {/* Summary Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
        }}
      >
        <DashboardCard
          title="Businesses"
          value={overview.total_businesses}
        />

        <DashboardCard
          title="Websites"
          value={overview.businesses_with_websites}
        />

        <DashboardCard
          title="Website Score"
          value={overview.average_website_score}
        />

        <DashboardCard
          title="Opportunities"
          value={overview.total_opportunities}
        />
      </div>

      {/* Charts */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "40px",
        }}
      >
        {/* Pie Chart */}

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Businesses by Category
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="count"
                nameKey="category"
                outerRadius={110}
                label
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Website Bar Chart */}

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Website Availability
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={websiteData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;