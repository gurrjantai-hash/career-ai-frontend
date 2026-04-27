"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [form, setForm] = useState({
    current_role: "",
    experience_years: "",
    current_salary_lpa: "",
    city: "",
    skills: "",
    goal: "Increase salary",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const analyzeCareer = async () => {
    setLoading(true);
    setResult(null);

    const payload = {
      current_role: form.current_role,
      experience_years: Number(form.experience_years),
      current_salary_lpa: Number(form.current_salary_lpa),
      city: form.city,
      skills: form.skills.split(",").map((s) => s.trim()),
      goal: form.goal,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/career/analyze`,
        payload
      );
      setResult(res.data);
    } catch (err) {
      alert("Something went wrong. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-2">
          Career AI Income Growth Engine
        </h1>
        <p className="text-gray-600 mb-6">
          Get your salary gap, skill gaps, and 4-week roadmap.
        </p>

        <div className="grid gap-4">
          <input name="current_role" placeholder="Current Role" className="border p-3 rounded" onChange={handleChange} />
          <input name="experience_years" placeholder="Experience in years" className="border p-3 rounded" onChange={handleChange} />
          <input name="current_salary_lpa" placeholder="Current Salary LPA" className="border p-3 rounded" onChange={handleChange} />
          <input name="city" placeholder="City" className="border p-3 rounded" onChange={handleChange} />
          <input name="skills" placeholder="Skills comma separated e.g. Java, Spring Boot, AWS" className="border p-3 rounded" onChange={handleChange} />

          <select name="goal" className="border p-3 rounded" onChange={handleChange}>
            <option>Increase salary</option>
            <option>Switch job</option>
            <option>Change domain</option>
          </select>

          <button
            onClick={analyzeCareer}
            className="bg-black text-white p-3 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze My Career"}
          </button>
        </div>

        {result && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">Your Career Analysis</h2>

            <p><b>Role Cluster:</b> {result.role_cluster}</p>
            <p><b>Current Level:</b> {result.current_level}</p>

            <div className="mt-4 bg-gray-100 p-4 rounded">

              <h2 className="text-xl font-bold text-green-600">
                You can potentially increase your salary significantly
              </h2>

              <p className="text-red-600 text-lg font-bold mt-2">
                {result.salary_insight.salary_gap_lpa}
              </p>

              <p className="text-sm text-gray-500">
                Based on current market trends for your profile
              </p>

              <div className="mt-3">
                <p><b>Current:</b> ₹{result.salary_insight.current_salary_lpa} LPA</p>
                <p>
                  <b>Market Range:</b> ₹{result.salary_insight.market_min_lpa}L - ₹
                    {result.salary_insight.market_max_lpa}L
                </p>
              </div>

            </div>

            <h3 className="font-bold mt-4">Target Roles</h3>
            <ul className="list-disc ml-6">
              {result.target_roles.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <h3 className="font-bold mt-4">Top Skill Gaps</h3>
            <ul className="list-disc ml-6">
              {result.top_skill_gaps.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h3 className="font-bold mt-4">4-Week Roadmap</h3>
            {Object.entries(result.roadmap_4_weeks).map(([week, tasks]: any) => (
              <div key={week} className="mt-3">
                <b>{week.replace("_", " ").toUpperCase()}</b>
                <ul className="list-disc ml-6">
                  {tasks.map((task: string, i: number) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h3 className="font-bold mt-4">Resume Suggestions</h3>
            <ul className="list-disc ml-6">
              {result.resume_suggestions.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}