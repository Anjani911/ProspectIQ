import { useEffect, useState } from "react";
import Discover from "./pages/discover";
import BusinessDetails from "./pages/BusinessDetails";
import AddBusiness from "./pages/AddBusiness";
import Opportunities from "./pages/Opportunities";
import Layout from "./components/Layout";
import {
  BuildingIcon,
  WebsiteIcon,
  ScoreIcon,
  OpportunityIcon,
  FireIcon,
  SparklesIcon,
  PlusIcon,
  ExternalLinkIcon,
  AlertIcon,
} from "./components/Icons";

import axios from "axios";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

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
  Legend,
} from "recharts";

const API_URL = "http://127.0.0.1:8000";

const COLORS = [
  "#0f766e",
  "#d97706",
  "#2563eb",
  "#be123c",
  "#475569",
  "#7c3aed",
];

const STATUS_COLORS = {
  new: "#2563eb",
  contacted: "#d97706",
  in_progress: "#0f766e",
  completed: "#64748b",
};

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [opportunityTypes, setOpportunityTypes] = useState([]);
  const [scores, setScores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setError("");

      const [
        summaryResponse,
        businessesResponse,
        statusResponse,
        typesResponse,
        scoresResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/businesses/dashboard/summary`),
        axios.get(`${API_URL}/businesses/`),
        axios.get(`${API_URL}/analytics/status`),
        axios.get(`${API_URL}/analytics/types`),
        axios.get(`${API_URL}/analytics/website-scores`),
      ]);

      setSummary(summaryResponse.data);
      setBusinesses(businessesResponse.data);
      setStatuses(statusResponse.data);
      setOpportunityTypes(typesResponse.data);
      setScores(scoresResponse.data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">
            Loading ProspectIQ Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const scoreRanges = [
    { name: "Not analyzed", value: (summary?.total_businesses || 0) - scores.length },
    { name: "0-39", value: 0 },
    { name: "40-59", value: 0 },
    { name: "60-79", value: 0 },
    { name: "80-100", value: 0 },
  ];

  scores.forEach(({ score }) => {
    const numericScore = Number(score);

    if (numericScore < 40) scoreRanges[1].value += 1;
    else if (numericScore < 60) scoreRanges[2].value += 1;
    else if (numericScore < 80) scoreRanges[3].value += 1;
    else scoreRanges[4].value += 1;
  });

  const visibleOpportunityTypes = opportunityTypes.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Find businesses and identify growth opportunities across your pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <SparklesIcon className="w-4 h-4 text-blue-600" />
            <span>Discover Leads</span>
          </Link>
          <Link
            to="/businesses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Business</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertIcon className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Businesses"
          value={summary?.total_businesses ?? 0}
          icon={BuildingIcon}
          subtitle="Tracked business leads"
          badgeColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Businesses With Websites"
          value={summary?.businesses_with_websites ?? 0}
          icon={WebsiteIcon}
          subtitle="Online presence detected"
          badgeColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Average Website Score"
          value={summary?.average_website_score ?? 0}
          icon={ScoreIcon}
          subtitle="Out of 100 max score"
          badgeColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Total Opportunities"
          value={summary?.total_opportunities ?? 0}
          icon={OpportunityIcon}
          subtitle="Identified growth leads"
          badgeColor="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Mini Cards Row */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <MiniCard
          label="New Opportunities"
          value={summary?.new_opportunities ?? 0}
          icon={SparklesIcon}
          description="Recently generated actionable intelligence"
          accentColor="border-l-4 border-l-blue-500"
        />
        <MiniCard
          label="High Priority"
          value={summary?.high_priority_opportunities ?? 0}
          icon={FireIcon}
          description="Critical items requiring immediate outreach"
          accentColor="border-l-4 border-l-rose-500"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Opportunity Pipeline */}
        <div className="dashboard-panel">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Opportunity Pipeline
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Progress of identified work
              </p>
            </div>
            <span className="dashboard-label">
              {summary?.total_opportunities ?? 0} Total
            </span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statuses}
                dataKey="count"
                nameKey="status"
                outerRadius={100}
                innerRadius={64}
                paddingAngle={2}
              >
                {statuses.map((entry, index) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Opportunities`, "Count"]} />
              <Legend formatter={(value) => value.replace("_", " ")} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Website Problems */}
        <div className="dashboard-panel">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Website Problems
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Most common issues worth pitching
              </p>
            </div>
            <span className="dashboard-label">
              Top 6 issues
            </span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={visibleOpportunityTypes}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="2 4" horizontal={false} stroke="#e2e8f0" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="title"
                width={150}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip formatter={(value) => [`${value} Opportunities`, "Count"]} />
              <Bar
                dataKey="count"
                fill="#0f766e"
                radius={[0, 3, 3, 0]}
                barSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Website Score Distribution</h2>
            <p className="text-xs text-slate-500 mt-0.5">Find prospects with the clearest improvement opportunity</p>
          </div>
          <span className="dashboard-label">{scores.length} analyzed</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={scoreRanges} margin={{ top: 4, right: 16, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} Businesses`, "Count"]} />
            <Bar dataKey="value" fill="#d97706" radius={[3, 3, 0, 0]} barSize={42} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Businesses Table Section */}
      <section
        id="businesses"
        className="dashboard-panel overflow-hidden p-0"
      >
        <div className="flex flex-col gap-4 border-b border-slate-200/80 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Tracked Businesses
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Manage your business prospects and analysis status
            </p>
          </div>
          <Link
            to="/businesses/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition-colors self-start sm:self-auto"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Business</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Business</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Website Score</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {businesses.map((business) => (
                <tr
                  key={business.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">
                      {business.name}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 flex items-center gap-1">
                      {business.website_url ? (
                        <a
                          href={business.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-blue-600 inline-flex items-center gap-1 truncate max-w-xs"
                        >
                          <span>{business.website_url}</span>
                          <ExternalLinkIcon className="w-3 h-3 text-slate-400 shrink-0" />
                        </a>
                      ) : (
                        <span className="italic text-slate-400">No website</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {business.category || "General"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600 text-xs">
                    {business.location || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <ScoreBadge score={business.website_score} />
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize">
                      {business.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/businesses/${business.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-xs"
                    >
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))}

              {businesses.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BuildingIcon className="w-8 h-8 text-slate-300" />
                      <p className="font-medium text-slate-700">No businesses tracked yet</p>
                      <p className="text-xs text-slate-400">
                        Add a business manually or use Discover to find local prospects.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Opportunity Overview Section */}
      <section className="dashboard-panel">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Opportunity Overview
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Quick snapshot of identified opportunities in your pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-xs font-medium text-slate-500">New Opportunities</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">
              {summary?.new_opportunities ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-xs font-medium text-slate-500">High Priority</p>
            <p className="mt-2 text-2xl font-bold text-rose-600">
              {summary?.high_priority_opportunities ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-xs font-medium text-slate-500">Total Opportunities</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {summary?.total_opportunities ?? 0}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, subtitle, badgeColor }) {
  return (
    <div className="dashboard-panel transition-colors duration-200 hover:border-[#b9b2a5] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{title}</span>
        {Icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${badgeColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function MiniCard({ label, value, icon: Icon, description, accentColor }) {
  return (
    <div className={`dashboard-panel transition-colors hover:border-[#b9b2a5] ${accentColor} flex items-center justify-between`}>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="mt-1 text-3xl font-bold text-slate-900">
          {value}
        </p>
        {description && (
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        )}
      </div>
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ score }) {
  if (score === null || score === undefined) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
        Not analyzed
      </span>
    );
  }

  let badgeStyle = "bg-rose-50 text-rose-700 border-rose-200/60";

  if (score >= 80) {
    badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  } else if (score >= 50) {
    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200/60";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeStyle}`}
    >
      {score}/100
    </span>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/businesses/new" element={<AddBusiness />} />
          <Route path="/businesses/:id" element={<BusinessDetails />} />
          <Route path="/opportunities" element={<Opportunities />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
