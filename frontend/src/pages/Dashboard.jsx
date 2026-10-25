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
  LineChart,
  Line,
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
  const [scores, setScores] = useState([]);
  const [growth, setGrowth] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [
        summaryRes,
        categoryRes,
        scoreRes,
        growthRes,
      ] = await Promise.all([
        api.get("/businesses/dashboard/summary"),
        api.get("/analytics/categories"),
        api.get("/analytics/website-scores"),
        api.get("/analytics/growth"),
      ]);

      setOverview(summaryRes.data);
      setCategories(categoryRes.data);
      setScores(scoreRes.data);
      setGrowth(growthRes.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  if (!overview) {
    return (
      <div
        style={{
          padding: "30px",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  // --------------------------------------------------
  // WEBSITE AVAILABILITY
  // --------------------------------------------------

  const websiteData = [
    {
      name: "Has Website",
      value: overview.businesses_with_websites || 0,
    },
    {
      name: "No Website",
      value:
        (overview.total_businesses || 0) -
        (overview.businesses_with_websites || 0),
    },
  ];

  // --------------------------------------------------
  // WEBSITE SCORE HISTOGRAM
  // --------------------------------------------------

  const scoreRanges = [
    { name: "0–20", min: 0, max: 20, value: 0 },
    { name: "21–40", min: 21, max: 40, value: 0 },
    { name: "41–60", min: 41, max: 60, value: 0 },
    { name: "61–80", min: 61, max: 80, value: 0 },
    { name: "81–100", min: 81, max: 100, value: 0 },
  ];

  scores.forEach((business) => {
    const score = Number(business.score);

    if (score >= 0 && score <= 20) {
      scoreRanges[0].value++;
    } else if (score <= 40) {
      scoreRanges[1].value++;
    } else if (score <= 60) {
      scoreRanges[2].value++;
    } else if (score <= 80) {
      scoreRanges[3].value++;
    } else if (score <= 100) {
      scoreRanges[4].value++;
    }
  });

  // --------------------------------------------------
  // GROWTH DATA
  // --------------------------------------------------

  const growthData = growth.map((item) => ({
    date: item.date,
    businesses: item.total_businesses,
    newBusinesses: item.new_businesses,
  }));

  return (
    <div
      style={{
        padding: "30px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "#0f172a",
        }}
      >
        ProspectIQ Dashboard
      </h1>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        <DashboardCard
          title="Businesses"
          value={overview.total_businesses || 0}
        />

        <DashboardCard
          title="Websites"
          value={overview.businesses_with_websites || 0}
        />

        <DashboardCard
          title="Website Score"
          value={
            Number(overview.average_website_score || 0).toFixed(1)
          }
        />

        <DashboardCard
          title="Opportunities"
          value={overview.total_opportunities || 0}
        />
      </div>

      {/* ==================================================
          ROW 1 — CATEGORY + GROWTH
      ================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "40px",
        }}
      >
        {/* CATEGORY PIE */}

        <ChartCard
          title="Businesses by Category"
          subtitle="Industry distribution of prospects"
        >
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="count"
                nameKey="category"
                outerRadius={110}
                label={({ category, percent }) =>
                  `${category} (${(percent * 100).toFixed(0)}%)`
                }
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
        </ChartCard>

        {/* GROWTH LINE */}

        <ChartCard
          title="Prospect Growth"
          subtitle="Cumulative businesses discovered over time"
        >
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="businesses"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ==================================================
          ROW 2 — HISTOGRAM + WEBSITE AVAILABILITY
      ================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "30px",
        }}
      >
        {/* WEBSITE SCORE HISTOGRAM */}

        <ChartCard
          title="Website Score Distribution"
          subtitle="Distribution of analyzed website scores"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={scoreRanges}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* WEBSITE AVAILABILITY */}

        <ChartCard
          title="Website Availability"
          subtitle="Online presence audit status"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={websiteData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ==================================================
          ANALYTICS SUMMARY
      ================================================== */}

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <InfoCard
          title="Analyzed Websites"
          value={scores.length}
          description="Businesses with website analysis"
        />

        <InfoCard
          title="Categories"
          value={categories.length}
          description="Business categories discovered"
        />

        <InfoCard
          title="New Prospects"
          value={
            growth.length
              ? growth[growth.length - 1].new_businesses
              : 0
          }
          description="Businesses added on the latest date"
        />
      </div>
    </div>
  );
}


/* ======================================================
   CHART CARD
====================================================== */

function ChartCard({ title, subtitle, children }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,.08)",
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <h2
          style={{
            margin: 0,
            color: "#0f172a",
            fontSize: "20px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            marginTop: "5px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}


/* ======================================================
   INFO CARD
====================================================== */

function InfoCard({ title, value, description }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,.08)",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: "8px 0",
          color: "#0f172a",
        }}
      >
        {value}
      </h2>

      <p
        style={{
          margin: 0,
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default Dashboard;