import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon, BuildingIcon, AlertIcon, PlusIcon } from "../components/Icons";

const API_URL = "http://127.0.0.1:8000";

function AddBusiness() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    website_url: "",
    category: "",
    location: "",
    has_website: false,
    website_score: null,
    is_outdated: false,
    email: "",
    phone: "",
    status: "new",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Business name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await axios.post(
        `${API_URL}/businesses/`,
        {
          ...form,
          has_website: Boolean(form.website_url),
          website_score: null,
          is_outdated: false,
        }
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
        "Failed to create business."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Add Business
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new prospect lead to your ProspectIQ tracking pipeline.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <BuildingIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-semibold text-slate-900">
            Prospect Information
          </h2>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
            <AlertIcon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Business Name <span className="text-rose-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. ABC Boutique"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Website URL
            </label>
            <input
              name="website_url"
              value={form.website_url}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Retail, Tech, Healthcare..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, State"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hello@business.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Phone Number
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +1 555-0199"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add key insights, notes, or background context about this prospect..."
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Business</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBusiness;