import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeftIcon,
  OpportunityIcon,
  AlertIcon,
  BuildingIcon,
  ExternalLinkIcon,
} from "../components/Icons";

const API_URL = "http://127.0.0.1:8000";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/businesses/opportunities/all`
      );

      setOpportunities(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load opportunities.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (opportunityId, status) => {
    try {
      await axios.patch(
        `${API_URL}/businesses/opportunities/${opportunityId}/status`,
        null,
        {
          params: { status },
        }
      );

      await loadOpportunities();
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">
            Loading opportunities...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Opportunities
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Business growth opportunities identified across your ProspectIQ pipeline.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 self-start sm:self-auto">
            {opportunities.length} Actionable Leads
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertIcon className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {opportunities.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <OpportunityIcon className="w-6 h-6" />
          </div>
          <p className="mt-4 font-semibold text-slate-800">No opportunities found</p>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Run website analysis on tracked businesses or discover new prospects to generate opportunities.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-base font-bold text-slate-900">
                      {opportunity.title}
                    </h2>

                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        opportunity.priority === "high"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : opportunity.priority === "medium"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {opportunity.priority} priority
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600">
                    {opportunity.description}
                  </p>

                  <div className="pt-1">
                    <Link
                      to={`/businesses/${opportunity.business_id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>View Business Details</span>
                      <ExternalLinkIcon className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="shrink-0">
                  <select
                    value={opportunity.status}
                    onChange={(e) => updateStatus(opportunity.id, e.target.value)}
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
          ))}
        </div>
      )}
    </div>
  );
}

export default Opportunities;