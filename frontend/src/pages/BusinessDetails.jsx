import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeftIcon,
  WebsiteIcon,
  ScoreIcon,
  ClockIcon,
  SparklesIcon,
  ExternalLinkIcon,
  AlertIcon,
  CheckCircleIcon,
  BuildingIcon,
} from "../components/Icons";

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
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">
            Loading business details...
          </p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
        <AlertIcon className="mx-auto w-8 h-8 text-rose-600 mb-2" />
        <h2 className="text-lg font-bold text-rose-900">Business Not Found</h2>
        <p className="text-xs text-rose-700 mt-1">The requested business profile could not be located.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {business.name}
              </h1>
              {business.category && (
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {business.category}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Location: {business.location || "Location unavailable"}
            </p>
          </div>

          <button
            onClick={analyzeWebsite}
            disabled={analyzing || !business.website_url}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 transition-all self-start sm:self-auto"
          >
            {analyzing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Analyzing Website...</span>
              </>
            ) : !business.website_url ? (
              <span>No Website to Analyze</span>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                <span>Analyze Website</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertIcon className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <WebsiteIcon className="w-4 h-4 text-blue-600" />
            <span>Website URL</span>
          </div>
          <div className="mt-3 font-medium text-slate-900 break-all text-sm">
            {business.website_url ? (
              <a
                href={business.website_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 underline"
              >
                <span className="truncate max-w-full">{business.website_url}</span>
                <ExternalLinkIcon className="w-3.5 h-3.5 shrink-0" />
              </a>
            ) : (
              <span className="italic text-slate-400">No website registered</span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <ScoreIcon className="w-4 h-4 text-amber-500" />
            <span>Website Audit Score</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {business.website_score ?? "—"}
            </span>
            {business.website_score !== null && business.website_score !== undefined && (
              <span className="text-xs font-medium text-slate-400">/ 100</span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <ClockIcon className="w-4 h-4 text-emerald-600" />
            <span>Analysis Status</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {business.analyzed_at ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                <span>Analyzed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                <span>Not analyzed yet</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Opportunities Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Identified Opportunities
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Growth recommendations & technical issues uncovered by analysis
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {opportunities.length} Total
          </span>
        </div>

        {opportunities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-10 text-center">
            <BuildingIcon className="mx-auto w-8 h-8 text-slate-300 mb-2" />
            <p className="font-medium text-slate-700 text-sm">No opportunities generated yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Click the &quot;Analyze Website&quot; button above to generate opportunities for this business.
            </p>
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
  );
}

function OpportunityCard({ opportunity, onStatusChange }) {
  const priorityStyles = {
    high: "bg-rose-50 text-rose-700 border-rose-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-semibold text-slate-900 text-base">
              {opportunity.title}
            </h3>

            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                priorityStyles[opportunity.priority] || "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {opportunity.priority} priority
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-600">
            {opportunity.description}
          </p>
        </div>

        <div className="shrink-0">
          <select
            value={opportunity.status}
            onChange={(e) => onStatusChange(opportunity.id, e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="new">Status: New</option>
            <option value="contacted">Status: Contacted</option>
            <option value="in_progress">Status: In Progress</option>
            <option value="completed">Status: Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default BusinessDetails;