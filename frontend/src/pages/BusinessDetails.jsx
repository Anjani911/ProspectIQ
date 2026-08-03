import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBusiness();
  }, [id]);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      setError("");

      const [businessResponse, opportunitiesResponse] =
        await Promise.all([
          axios.get(`${API_URL}/businesses/${id}`),
          axios.get(`${API_URL}/businesses/${id}/opportunities`),
        ]);

      setBusiness(businessResponse.data);
      setOpportunities(opportunitiesResponse.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load business details.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeWebsite = async () => {
    try {
      setAnalyzing(true);
      setError("");

      await axios.post(
        `${API_URL}/businesses/${id}/analyze`
      );

      await loadBusiness();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
        "Website analysis failed."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const updateOpportunityStatus = async (
    opportunityId,
    status
  ) => {
    try {
      await axios.patch(
        `${API_URL}/businesses/opportunities/${opportunityId}/status`,
        null,
        {
          params: { status },
        }
      );

      await loadBusiness();
    } catch (err) {
      console.error(err);
      setError("Failed to update opportunity status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-slate-600">
          Loading business...
        </p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-red-600">
          Business not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/")}
              className="mb-3 text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold text-slate-900">
              {business.name}
            </h1>

            <p className="mt-1 text-slate-500">
              {business.category || "Business"} ·{" "}
              {business.location || "Location unavailable"}
            </p>
          </div>

         <button
  onClick={analyzeWebsite}
  disabled={analyzing || !business.website_url}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {!business.website_url
  ? "No Website"
  : analyzing
  ? "Analyzing..."
  : "Analyze Website"}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Website
            </p>

            <p className="mt-2 break-all font-medium text-slate-900">
              {business.website_url ? (
  <a
    href={business.website_url}
    target="_blank"
    rel="noreferrer"
    className="text-blue-600 underline"
  >
    {business.website_url}
  </a>
) : (
  "No website"
)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Website Score
            </p>

            <p className="mt-2 text-4xl font-bold text-blue-600">
              {business.website_score ?? "—"}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Analysis Status
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {business.analyzed_at
                ? "Analyzed"
                : "Not analyzed"}
            </p>
          </div>
        </div>

        {/* Opportunities */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Opportunities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Issues identified from the website analysis.
            </p>
          </div>

          {opportunities.length === 0 ? (
            <div className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">
              No opportunities found yet.
              Run website analysis to generate them.
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onStatusChange={updateOpportunityStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({
  opportunity,
  onStatusChange,
}) {
  const priorityClasses = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-green-100 text-green-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 p-5">

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-semibold text-slate-900">
              {opportunity.title}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                priorityClasses[
                  opportunity.priority
                ] || "bg-slate-100 text-slate-700"
              }`}
            >
              {opportunity.priority}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {opportunity.description}
          </p>
        </div>

        <select
          value={opportunity.status}
          onChange={(e) =>
            onStatusChange(
              opportunity.id,
              e.target.value
            )
          }
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in_progress">
            In Progress
          </option>
          <option value="completed">
            Completed
          </option>
        </select>
      </div>
    </div>
  );
}

export default BusinessDetails;