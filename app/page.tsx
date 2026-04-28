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

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900";

const labelClass = "mb-1 block text-sm font-medium text-slate-700";

function normalizeCareerResult(data: any): CareerResult {
  const salaryInsight = data?.salary_insight || {};

  return {
    role_cluster: data?.role_cluster || "Unknown",
    current_level: data?.current_level || "Not available",

    summary:
      data?.summary ||
      "Summary is not available for this analysis. Please try again.",

    recommended_next_move:
      data?.recommended_next_move ||
      "Recommended next move is not available for this analysis.",

    salary_insight: {
      current_salary_lpa: Number(salaryInsight.current_salary_lpa || 0),
      market_min_lpa: Number(salaryInsight.market_min_lpa || 0),
      market_max_lpa: Number(salaryInsight.market_max_lpa || 0),
      salary_gap_lpa: salaryInsight.salary_gap_lpa || "Not available",
      confidence: salaryInsight.confidence || "Not available",
    },

    target_roles: Array.isArray(data?.target_roles) ? data.target_roles : [],

    top_skill_gaps: Array.isArray(data?.top_skill_gaps)
      ? data.top_skill_gaps
      : [],

    skill_salary_impact:
      data?.skill_salary_impact &&
      typeof data.skill_salary_impact === "object"
        ? data.skill_salary_impact
        : {},

    roadmap_4_weeks:
      data?.roadmap_4_weeks && typeof data.roadmap_4_weeks === "object"
        ? data.roadmap_4_weeks
        : {},

    resume_suggestions: Array.isArray(data?.resume_suggestions)
      ? data.resume_suggestions
      : [],

    confidence_notes: Array.isArray(data?.confidence_notes)
      ? data.confidence_notes
      : [],

    disclaimer:
      data?.disclaimer ||
      "This is an AI-assisted estimate and not a guaranteed salary prediction.",
  };
}

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
      !form.current_role.trim() ||
      !form.experience_years ||
      !form.current_salary_lpa ||
      !form.city.trim() ||
      !form.skills.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    const payload = {
      current_role: form.current_role.trim(),
      experience_years: Number(form.experience_years),
      current_salary_lpa: Number(form.current_salary_lpa),
      city: form.city.trim(),
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      goal: form.goal,
    };

    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/career/analyze`,
        payload
      );

      console.log("Career analysis response:", res.data);

      const safeResult = normalizeCareerResult(res.data);
      setResult(safeResult);
    } catch (error: any) {
      console.error("Career analysis failed:", error);

      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Something went wrong. Please try again.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl sm:mb-8 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-300 sm:text-sm">
            AI Career & Income Growth Engine
          </p>

          <h1 className="mb-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            Find your salary gap and get a 4-week roadmap to grow your income.
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Enter your current role, salary, city and skills. The AI will
            analyze your profile and suggest realistic target roles, high-ROI
            skills, and a practical execution roadmap.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-5">
          <section className="rounded-3xl bg-white p-5 shadow sm:p-6 lg:col-span-2">
            <h2 className="mb-1 text-2xl font-bold text-slate-900">
              Your Career Profile
            </h2>

            <p className="mb-6 text-sm leading-6 text-slate-500">
              Keep this accurate. Better input gives better recommendations.
            </p>

            <div className="grid gap-4">
              <div>
                <label className={labelClass}>Current Role</label>
                <input
                  name="current_role"
                  placeholder="e.g. Java Developer"
                  className={inputClass}
                  value={form.current_role}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className={labelClass}>Experience in Years</label>
                <input
                  name="experience_years"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 4"
                  className={inputClass}
                  value={form.experience_years}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={labelClass}>Current Salary in LPA</label>
                <input
                  name="current_salary_lpa"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 10"
                  className={inputClass}
                  value={form.current_salary_lpa}
                  onChange={handleChange}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Enter salary in LPA. Example: 10 means ₹10 LPA.
                </p>
              </div>

              <div>
                <label className={labelClass}>City</label>
                <input
                  name="city"
                  placeholder="e.g. Bangalore"
                  className={inputClass}
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                />
              </div>

              <div>
                <label className={labelClass}>Skills</label>
                <input
                  name="skills"
                  placeholder="Java, Spring Boot, Microservices"
                  className={inputClass}
                  value={form.skills}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Add comma-separated skills.
                </p>
              </div>

              <div>
                <label className={labelClass}>Goal</label>
                <select
                  name="goal"
                  className={inputClass}
                  value={form.goal}
                  onChange={handleChange}
                >
                  <option value="Increase salary">Increase salary</option>
                  <option value="Switch job">Switch job</option>
                  <option value="Change domain">Change domain</option>
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
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm sm:min-h-[500px] sm:p-8">
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-slate-900">
                    Your analysis will appear here
                  </h2>
                  <p className="mx-auto max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                    Fill the form and generate your salary gap, skill gaps,
                    target roles and 4-week roadmap.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-white p-6 text-center shadow sm:min-h-[500px] sm:p-8">
                <div>
                  <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950"></div>
                  <h2 className="mb-2 text-2xl font-bold text-slate-900">
                    Analyzing your income growth path...
                  </h2>
                  <p className="text-sm leading-6 text-slate-500 sm:text-base">
                    Mapping your role, estimating salary gap, and creating your
                    4-week roadmap.
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                  <div className="mb-4 flex flex-wrap gap-3">
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      {result.role_cluster}
                    </span>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      {result.current_level} Level
                    </span>
                  </div>

                  <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Your Career Analysis
                  </h2>

                  <p className="text-sm leading-6 text-slate-600 sm:text-base">
                    {result.summary}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-slate-950 p-5 text-white shadow sm:p-6">
                    <p className="mb-2 text-sm text-slate-300">
                      Current Salary
                    </p>
                    <p className="text-3xl font-bold">
                      ₹{result.salary_insight.current_salary_lpa}L
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                    <p className="mb-2 text-sm text-slate-500">
                      Market Range
                    </p>
                    <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      ₹{result.salary_insight.market_min_lpa}L - ₹
                      {result.salary_insight.market_max_lpa}L
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                    <p className="mb-2 text-sm text-slate-500">Salary Gap</p>
                    <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                      {result.salary_insight.salary_gap_lpa}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-emerald-50 p-5 shadow-sm sm:p-6">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
                    Recommended Next Move
                  </p>
                  <p className="text-lg font-bold leading-7 text-emerald-950 sm:text-xl">
                    {result.recommended_next_move}
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    Target Roles
                  </h3>

                  {result.target_roles.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No target roles available.
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-3">
                      {result.target_roles.map((role, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-slate-200 p-4"
                        >
                          <p className="text-sm text-slate-500">
                            Option {index + 1}
                          </p>
                          <p className="font-semibold text-slate-900">
                            {role}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    High-ROI Skill Gaps
                  </h3>

                  {result.top_skill_gaps.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No skill gaps available.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {result.top_skill_gaps.map((skill, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-slate-200 p-4"
                        >
                          <p className="font-semibold text-slate-900">
                            {skill}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {result.skill_salary_impact[skill] ||
                              "This skill can improve your employability for better-paying roles."}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    4-Week Action Roadmap
                  </h3>

                  {Object.keys(result.roadmap_4_weeks).length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Roadmap is not available.
                    </p>
                  ) : (
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
                              {(tasks || []).map((task, index) => (
                                <li
                                  key={index}
                                  className="flex gap-2 text-sm leading-6 text-slate-600"
                                >
                                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-900"></span>
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    Resume Suggestions
                  </h3>

                  {result.resume_suggestions.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No resume suggestions available.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {result.resume_suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-3xl bg-amber-50 p-5 sm:p-6">
                  <h3 className="mb-4 text-xl font-bold text-amber-950">
                    Confidence Notes
                  </h3>

                  {result.confidence_notes.length === 0 ? (
                    <p className="text-sm text-amber-900">
                      Confidence notes are not available.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {result.confidence_notes.map((note, index) => (
                        <li
                          key={index}
                          className="text-sm leading-6 text-amber-900"
                        >
                          • {note}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="mt-4 text-sm leading-6 text-amber-900">
                    {result.disclaimer}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-amber-800">
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