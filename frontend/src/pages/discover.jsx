import { useState } from "react";
import axios from "axios";
import {
  DiscoverIcon,
  LocationIcon,
  PhoneIcon,
  WebsiteIcon,
  SparklesIcon,
  ExternalLinkIcon,
  AlertIcon,
  BuildingIcon,
} from "../components/Icons";

const API_URL = "http://127.0.0.1:8000";

export default function Discover() {
  const [form, setForm] = useState({
    category: "",
    location: "",
    radius_meters: 5000,
    max_results: 10,
  });

  const [loading, setLoading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const discoverBusinesses = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API_URL}/businesses/discover`,
        form
      );

      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError("Discovery failed. Please verify API connection or search parameters.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (businessId) => {
    try {
      setAnalyzingId(businessId);
      await axios.post(`${API_URL}/businesses/${businessId}/analyze`);
      const updated = await axios.get(`${API_URL}/businesses/${businessId}`);

      setResults((prev) =>
        prev.map((b) => (b.id === businessId ? updated.data : b))
      );
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.detail || "Analysis failed");
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Discover Businesses
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Find local business prospects by category, location, and radius to uncover growth leads.
        </p>
      </div>

      {/* Discovery Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <DiscoverIcon className="w-5 h-5 text-blue-600" />
            <span>Prospect Search Parameters</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Category
            </label>
            <select
  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
  value={form.category}
  onChange={(e) =>
    setForm({
      ...form,
      category: e.target.value,
    })
  }
>
  <option value="">Select a category</option>

  <option value="boutique">Boutique</option>
  <option value="clothing">Clothing Store</option>
  <option value="fashion">Fashion Store</option>
  <option value="salon">Salon</option>
  <option value="beauty">Beauty Business</option>
  <option value="restaurant">Restaurant</option>
  <option value="cafe">Café</option>
  <option value="bakery">Bakery</option>
  <option value="jewelry">Jewelry Store</option>
  <option value="pharmacy">Pharmacy</option>
  <option value="supermarket">Supermarket</option>
  <option value="furniture">Furniture Store</option>
  <option value="electronics">Electronics Store</option>
  <option value="gym">Gym</option>
  <option value="hotel">Hotel</option>
</select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Location
            </label>
            <input
              placeholder="e.g. Chicago, IL or City Center"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              value={form.location}
              onChange={(e) =>
                setForm({
                  ...form,
                  location: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Search Radius (meters)
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              value={form.radius_meters}
              onChange={(e) =>
                setForm({
                  ...form,
                  radius_meters: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Max Results
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              value={form.max_results}
              onChange={(e) =>
                setForm({
                  ...form,
                  max_results: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertIcon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 pt-2">
          <button
            onClick={discoverBusinesses}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Discovering Prospects...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                <span>Discover Businesses</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Discovered Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Discovered Results
          </h2>
          {results.length > 0 && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {results.length} Found
            </span>
          )}
        </div>

        {results.length === 0 ? (
          <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <BuildingIcon className="w-6 h-6" />
            </div>
            <p className="mt-4 font-medium text-slate-800">No prospects discovered yet</p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Fill in your search parameters above and click Discover Businesses to fetch local business prospects.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {results.map((business) => (
              <div
                key={business.id}
                className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">
                        {business.name}
                      </h3>
                      {business.category && (
                        <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                          {business.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
                      {business.location && (
                        <div className="flex items-center gap-1.5">
                          <LocationIcon className="w-4 h-4 text-slate-400" />
                          <span>{business.location}</span>
                        </div>
                      )}

                      {business.phone && (
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="w-4 h-4 text-slate-400" />
                          <span>{business.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <WebsiteIcon className="w-4 h-4 text-slate-400" />
                        {business.website_url ? (
                          <a
                            href={business.website_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline inline-flex items-center gap-1 hover:text-blue-800"
                          >
                            <span>{business.website_url}</span>
                            <ExternalLinkIcon className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="italic text-slate-400">No Website</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAnalyze(business.id)}
                    disabled={analyzingId === business.id}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 transition-all self-start sm:self-center"
                  >
                    {analyzingId === business.id ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-3.5 h-3.5" />
                        <span>Analyze Website</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}