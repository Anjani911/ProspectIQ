import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardCard from "../components/DashboardCard";

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get("/businesses/dashboard/summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!summary) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>ProspectIQ Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <DashboardCard
          title="Businesses"
          value={summary.total_businesses}
        />

        <DashboardCard
          title="Websites"
          value={summary.businesses_with_websites}
        />

        <DashboardCard
          title="Avg Website Score"
          value={summary.average_website_score}
        />

        <DashboardCard
          title="Opportunities"
          value={summary.total_opportunities}
        />
      </div>
    </div>
  );
}

export default Dashboard;