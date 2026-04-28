"use client";

import { useState } from "react";
import axios from "axios";

type SalaryInsight = {
  current_salary_lpa: number;
  market_min_lpa: number;
  market_max_lpa: number;
  salary_gap_lpa: string;
  confidence: string;
};

type CareerResult = {
  role_cluster: string;
  current_level: string;
  summary: string;
  recommended_next_move: string;
  salary_insight: SalaryInsight;
  target_roles: string[];
  top_skill_gaps: string[];
  skill_salary_impact: Record<string, string>;
  roadmap_4_weeks: Record<string, string[]>;
  resume_suggestions: string[];
  confidence_notes: string[];
  disclaimer: string;
};

export default function Home() {
  const [form, setForm] = useState({
    current_role: "",
    experience_years: "",
    current_salary_lpa: "",
    city: "",
    skills: "",
    goal: "Increase salary",
  });

  const [result, setResult] = useState<CareerResult | null>(null);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const analyzeCareer = async () => {
    if (
      !form.current_role ||
      !form.experience_years ||
      !form.current_salary_lpa ||
      !form.city ||
      !form.skills
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    const payload = {
      current_role: form.current_role,
      experience_years: Number(form.experience_years),
      current_salary_lpa: Number(form.current_salary_lpa),
      city: form.city,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      goal: form.goal,
    };

    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/career/analyze`,
        payload
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-white shadow-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            AI Career & Income Growth Engine
          </p>

          <h1 className="mb-4 max-w-3xl text-4xl font-bold leading-tight">
            Find your salary gap and get a 4-week roadmap to grow your income.
          </h1>

          <p className="max-w-2xl text-slate-300">
            Enter your current role, salary, city and skills. The AI will
            analyze your profile and suggest realistic target roles, high-ROI
            skills, and a practical execution roadmap.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-2 rounded-3xl bg-white p-6 shadow">
            <h2 className="mb-1 text-2xl font-bold text-slate-900">
              Your Career Profile
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Keep this accurate. Better input gives better recommendations.
            </p>

            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Current Role
                </label>
                <input
                  name="current_role"
                  placeholder="e.g. Java Developer"
                  className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-slate-900"
                  value={form.current_role}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Experience in Years
                </label>
                <input
                  name="experience_years"
                  type="number"
                  placeholder="e.g. 4"
                  className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-slate-900"
                  value={form.experience_years}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Current Salary in LPA
                </label>
                <input
                  name="current_salary_lpa"
                  type="number"
                  placeholder="e.g. 10"
                  className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-slate-900"
                  value={form.current_salary_lpa}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  City
                </label>
                <input
                  name="city"
                  placeholder="e.g. Bangalore"
                  className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-slate-900"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Skills
                </label>
                <input
                  name="skills"
                  placeholder="Java, Spring Boot, Microservices"
                  className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-slate-900"
                  value={form.skills}
                  onChange={handleChange}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Add comma-separated skills.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Goal
                </label>
                <select
                  name="goal"
                  className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-slate-900"
                  value={form.goal}
                  onChange={handleChange}
                >
                  <option>Increase salary</option>
                  <option>Switch job</option>
                  <option>Change domain</option>
                </select>
              </div>

              <button
                onClick={analyzeCareer}
                disabled={loading}
                className="mt-2 rounded-xl bg-slate-950 p-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Analyzing your career..." : "Analyze My Career"}
              </button>
            </div>
          </section>

          <section className="lg:col-span-3">
            {!result && !loading && (
              <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-slate-900">
                    Your analysis will appear here
                  </h2>
                  <p className="mx-auto max-w-md text-slate-500">
                    Fill the form and generate your salary gap, skill gaps,
                    target roles and 4-week roadmap.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[500px] items-center justify-center rounded-3xl bg-white p-8 text-center shadow">
                <div>
                  <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950"></div>
                  <h2 className="mb-2 text-2xl font-bold text-slate-900">
                    Analyzing your income growth path...
                  </h2>
                  <p className="text-slate-500">
                    Mapping role cluster, estimating salary gap, and creating
                    your 4-week roadmap.
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-white p-6 shadow">
                  <div className="mb-4 flex flex-wrap gap-3">
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      {result.role_cluster}
                    </span>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      {result.current_level} Level
                    </span>
                  </div>

                  <h2 className="mb-3 text-3xl font-bold text-slate-900">
                    Your Career Analysis
                  </h2>

                  <p className="text-slate-600">{result.summary}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl bg-slate-950 p-6 text-white shadow">
                    <p className="mb-2 text-sm text-slate-300">
                      Current Salary
                    </p>
                    <p className="text-3xl font-bold">
                      ₹{result.salary_insight.current_salary_lpa}L
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow">
                    <p className="mb-2 text-sm text-slate-500">
                      Market Range
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      ₹{result.salary_insight.market_min_lpa}L - ₹
                      {result.salary_insight.market_max_lpa}L
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow">
                    <p className="mb-2 text-sm text-slate-500">
                      Salary Gap
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {result.salary_insight.salary_gap_lpa}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-emerald-50 p-6 shadow-sm">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
                    Recommended Next Move
                  </p>
                  <p className="text-xl font-bold text-emerald-950">
                    {result.recommended_next_move}
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    Target Roles
                  </h3>

                  <div className="grid gap-3 md:grid-cols-3">
                    {result.target_roles.map((role, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <p className="text-sm text-slate-500">
                          Option {index + 1}
                        </p>
                        <p className="font-semibold text-slate-900">{role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    High-ROI Skill Gaps
                  </h3>

                  <div className="space-y-3">
                    {result.top_skill_gaps.map((skill, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <p className="font-semibold text-slate-900">
                          {skill}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {result.skill_salary_impact[skill] ||
                            "This skill can improve your employability for better-paying roles."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    4-Week Action Roadmap
                  </h3>

                  <div className="space-y-4">
                    {Object.entries(result.roadmap_4_weeks).map(
                      ([week, tasks]) => (
                        <div
                          key={week}
                          className="rounded-2xl border border-slate-200 p-4"
                        >
                          <p className="mb-2 font-bold text-slate-900">
                            {week.replace("_", " ").toUpperCase()}
                          </p>
                          <ul className="space-y-2">
                            {tasks.map((task, index) => (
                              <li
                                key={index}
                                className="flex gap-2 text-sm text-slate-600"
                              >
                                <span className="mt-1 h-2 w-2 rounded-full bg-slate-900"></span>
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    Resume Suggestions
                  </h3>

                  <ul className="space-y-3">
                    {result.resume_suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl bg-amber-50 p-6">
                  <h3 className="mb-4 text-xl font-bold text-amber-950">
                    Confidence Notes
                  </h3>

                  <ul className="space-y-2">
                    {result.confidence_notes.map((note, index) => (
                      <li key={index} className="text-sm text-amber-900">
                        • {note}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-sm text-amber-900">
                    {result.disclaimer}
                  </p>

                  <p className="mt-2 text-xs text-amber-800">
                    Salary confidence: {result.salary_insight.confidence}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}