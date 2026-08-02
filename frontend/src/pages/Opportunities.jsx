import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-slate-600">
          Loading opportunities...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <Link
            to="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Opportunities
          </h1>

          <p className="mt-1 text-slate-500">
            Business growth opportunities identified by ProspectIQ.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {opportunities.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              No opportunities found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {opportunity.title}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          opportunity.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : opportunity.priority === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {opportunity.priority}
                      </span>
                    </div>

                    <p className="mt-2 text-slate-600">
                      {opportunity.description}
                    </p>

                    <Link
                      to={`/businesses/${opportunity.business_id}`}
                      className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Business →
                    </Link>
                  </div>

                  <select
                    value={opportunity.status}
                    onChange={(e) =>
                      updateStatus(
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Opportunities;