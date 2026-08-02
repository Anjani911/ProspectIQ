import { useEffect, useState } from "react";
import Discover from "./pages/Discover";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import BusinessDetails from "./pages/BusinessDetails";
import AddBusiness from "./pages/AddBusiness";
import Opportunities from "./pages/Opportunities";

const API_URL = "http://127.0.0.1:8000";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setError("");

      const [summaryResponse, businessesResponse] =
        await Promise.all([
          axios.get(
            `${API_URL}/businesses/dashboard/summary`
          ),
          axios.get(`${API_URL}/businesses/`),
        ]);

      setSummary(summaryResponse.data);
      setBusinesses(businessesResponse.data);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError(
        "Could not connect to the ProspectIQ backend."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">
          Loading ProspectIQ...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 p-6 text-white">
        <Link to="/" className="text-2xl font-bold">
          Prospect<span className="text-blue-400">IQ</span>
        </Link>

        <nav className="mt-10 space-y-2">
          <Link
            to="/"
            className="block rounded-lg bg-blue-600 px-4 py-3"
          >
            Dashboard
          </Link>

          <a
            href="#businesses"
            className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
          >
            Businesses
          </a>
        <Link
    to="/discover"
    className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
>
    Discover
</Link>
          <Link
            to="/opportunities"
            className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
          >
            Opportunities
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="ml-64 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="mt-1 text-slate-500">
              Find businesses and identify growth
              opportunities.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Total Businesses"
              value={summary?.total_businesses ?? 0}
            />

            <StatCard
              title="Businesses With Websites"
              value={
                summary?.businesses_with_websites ?? 0
              }
            />

            <StatCard
              title="Average Website Score"
              value={
                summary?.average_website_score ?? 0
              }
            />

            <StatCard
              title="Total Opportunities"
              value={
                summary?.total_opportunities ?? 0
              }
            />

            <StatCard
              title="New Opportunities"
              value={
                summary?.new_opportunities ?? 0
              }
            />

            <StatCard
              title="High Priority"
              value={
                summary?.high_priority_opportunities ?? 0
              }
            />
          </div>

          {/* Businesses */}
          <section
            id="businesses"
            className="mt-10 rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Businesses
                </h2>

                <p className="text-sm text-slate-500">
                  Your tracked business prospects
                </p>
              </div>

              <Link
                to="/businesses/new"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Business
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="px-4 py-3">Business</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">
                      Website Score
                    </th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {businesses.map((business) => (
                    <tr
                      key={business.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">
                          {business.name}
                        </div>

                        <div className="text-sm text-slate-500">
                          {business.website_url ||
                            "No website"}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {business.category || "-"}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {business.location || "-"}
                      </td>

                      <td className="px-4 py-4">
                        <ScoreBadge
                          score={business.website_score}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                          {business.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          to={`/businesses/${business.id}`}
                          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {businesses.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-10 text-center text-slate-500"
                      >
                        No businesses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Opportunity summary */}
          <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Opportunity Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Quick view of your current opportunity
              pipeline.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MiniCard
                label="New"
                value={summary?.new_opportunities ?? 0}
              />

              <MiniCard
                label="High Priority"
                value={
                  summary?.high_priority_opportunities ??
                  0
                }
              />

              <MiniCard
                label="Total"
                value={
                  summary?.total_opportunities ?? 0
                }
              />
            </div>
          </section>
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

function MiniCard({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function ScoreBadge({ score }) {
  if (score === null || score === undefined) {
    return (
      <span className="text-sm text-slate-500">
        Not analyzed
      </span>
    );
  }

  let classes = "bg-red-100 text-red-700";

  if (score >= 80) {
    classes = "bg-green-100 text-green-700";
  } else if (score >= 50) {
    classes = "bg-amber-100 text-amber-700";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold ${classes}`}
    >
      {score}/100
    </span>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/discover"
          element={<Discover />}
        />

        <Route
          path="/businesses/new"
          element={<AddBusiness />}
        />

        <Route
          path="/businesses/:id"
          element={<BusinessDetails />}
        />

        <Route
          path="/opportunities"
          element={<Opportunities />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


