import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export default function Discover() {
  const [form, setForm] = useState({
    category: "",
    location: "",
    radius_meters: 5000,
    max_results: 10,
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const discoverBusinesses = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/businesses/discover`,
        form
      );

      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Discovery failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 text-3xl font-bold">
          Discover Businesses
        </h1>

        <div className="rounded-xl bg-white p-6 shadow">

          <div className="grid gap-4 md:grid-cols-2">

            <input
              placeholder="Category (boutique)"
              className="rounded border p-3"
              value={form.category}
              onChange={(e)=>
                setForm({
                  ...form,
                  category:e.target.value
                })
              }
            />

            <input
              placeholder="Location"
              className="rounded border p-3"
              value={form.location}
              onChange={(e)=>
                setForm({
                  ...form,
                  location:e.target.value
                })
              }
            />

            <input
              type="number"
              className="rounded border p-3"
              value={form.radius_meters}
              onChange={(e)=>
                setForm({
                  ...form,
                  radius_meters:Number(e.target.value)
                })
              }
            />

            <input
              type="number"
              className="rounded border p-3"
              value={form.max_results}
              onChange={(e)=>
                setForm({
                  ...form,
                  max_results:Number(e.target.value)
                })
              }
            />

          </div>

          <button
            onClick={discoverBusinesses}
            className="mt-6 rounded bg-blue-600 px-6 py-3 text-white"
          >
            {loading ? "Searching..." : "Discover Businesses"}
          </button>

        </div>

        <div className="mt-8 space-y-4">

          {results.map((business)=>(
            <div
              key={business.id}
              className="rounded-xl bg-white p-5 shadow"
            >
              <h2 className="text-xl font-bold">
                {business.name}
              </h2>

              <p>{business.category}</p>

              <p>{business.location}</p>

              <p>{business.phone}</p>

              <p>
                Website:
                {" "}
                {business.website_url || "No Website"}
              </p>
            <button
  onClick={async () => {
    try {
      await axios.post(
        `${API_URL}/businesses/${business.id}/analyze`
      );

      const updated = await axios.get(
        `${API_URL}/businesses/${business.id}`
      );

      setResults(prev =>
        prev.map(b =>
          b.id === business.id ? updated.data : b
        )
      );

    } catch (err) {
  console.log(err.response?.data);
  alert(err.response?.data?.detail || "Analysis failed");
}
  }}
  className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
>
  Analyze
</button>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}