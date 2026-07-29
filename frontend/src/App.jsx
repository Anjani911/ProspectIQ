import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [summary, setSummary] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [summaryResponse, businessesResponse] = await Promise.all([
        axios.get(`${API_URL}/businesses/dashboard/summary`),
        axios.get(`${API_URL}/businesses/`),
      ]);

      setSummary(summaryResponse.data);
      setBusinesses(businessesResponse.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">
          Loading ProspectIQ...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold">
          Prospect<span className="text-blue-400">IQ</span>
        </h1>

        <nav className="mt-10 space-y-3">
          <div className="rounded-lg bg-blue-600 px-4 py-3">
            Dashboard
          </div>

          <div className="px-4 py-3 text-slate-300">
            Businesses
          </div>

          <div className="px-4 py-3 text-slate-300">
            Opportunities
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h2>
          <p className="mt-1 text-slate-500">
            Find businesses and identify growth opportunities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <StatCard
            title="Total Businesses"
            value={summary?.total_businesses ?? 0}
          />

          <StatCard
            title="Businesses With Websites"
            value={summary?.businesses_with_websites ?? 0}
          />

          <StatCard
            title="Average Website Score"
            value={summary?.average_website_score ?? 0}
          />

          <StatCard
            title="Total Opportunities"
            value={summary?.total_opportunities ?? 0}
          />

          <StatCard
            title="New Opportunities"
            value={summary?.new_opportunities ?? 0}
          />

          <StatCard
            title="High Priority"
            value={summary?.high_priority_opportunities ?? 0}
          />

        </div>

        {/* Businesses */}
        <div className="mt-10 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Businesses
              </h3>
              <p className="text-sm text-slate-500">
                Recently added businesses
              </p>
            </div>

            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              + Add Business
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Website Score</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {businesses.map((business) => (
                  <tr
                    key={business.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">
                        {business.name}
                      </div>

                      <div className="text-sm text-slate-500">
                        {business.website_url || "No website"}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {business.category || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {business.location || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-semibold text-blue-600">
                        {business.website_score ?? "Not analyzed"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {business.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {businesses.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No businesses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default App;