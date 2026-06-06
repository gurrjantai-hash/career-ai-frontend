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

type TargetSalaryInsight = {
  target_role: string;
  estimated_min_lpa: number;
  estimated_max_lpa: number;
  fit_level: string;
  salary_upside_note: string;
};

type GrowthPath = {
  path_name: string;
  fit_score: string;
  why_it_fits: string;
  target_roles: string[];
  skills_to_build: string[];
};

type CareerResult = {
  role_cluster: string;
  current_level: string;
  summary: string;
  recommended_next_move: string;
  goal_strategy: string;
  salary_insight: SalaryInsight;
  target_salary_insights: TargetSalaryInsight[];
  target_roles: string[];
  top_skill_gaps: string[];
  skill_salary_impact: Record<string, string>;
  growth_paths: GrowthPath[];
  why_recommendations: string[];
  roadmap_4_weeks: Record<string, string[]>;
  resume_suggestions: string[];
  confidence_notes: string[];
  disclaimer: string;
};

type ResumeBulletImprovement = {
  original: string;
  improved: string;
  reason: string;
};

type ResumeResult = {
  target_role: string;
  resume_alignment: string;
  alignment_summary: string;
  improved_profile_summary: string;
  improved_bullets: ResumeBulletImprovement[];
  missing_keywords: string[];
  resume_improvement_priorities: string[];
  naukri_headline: string;
  linkedin_summary: string;
  interview_positioning: string[];
  disclaimer: string;
};

type ProjectSuggestion = {
  project_name: string;
  description: string;
  skills_covered: string[];
  difficulty: string;
  portfolio_value: string;
};

type ResourceRecommendation = {
  topic: string;
  resource_type: string;
  what_to_search: string;
  expected_outcome: string;
};

type LearningPlanResult = {
  target_role: string;
  learning_goal: string;
  readiness_level: string;
  readiness_summary: string;
  revision_topics: string[];
  new_skills_to_learn: string[];
  project_suggestions: ProjectSuggestion[];
  interview_prep_topics: string[];
  resource_recommendations: ResourceRecommendation[];
  weekly_learning_plan: Record<string, string[]>;
  job_readiness_checklist: string[];
  disclaimer: string;
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900";

const textAreaClass =
  "min-h-[220px] w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900";

const labelClass = "mb-1 block text-sm font-medium text-slate-700";

function normalizeGrowthPaths(data: any): GrowthPath[] {
  if (!Array.isArray(data)) return [];

  return data.map((path) => ({
    path_name: path?.path_name || "Career Growth Path",
    fit_score: path?.fit_score || "Medium",
    why_it_fits:
      path?.why_it_fits ||
      "This path may fit based on your current role, skills and career goal.",
    target_roles: Array.isArray(path?.target_roles) ? path.target_roles : [],
    skills_to_build: Array.isArray(path?.skills_to_build)
      ? path.skills_to_build
      : [],
  }));
}

function normalizeTargetSalaryInsights(data: any): TargetSalaryInsight[] {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    target_role: item?.target_role || "Target role",
    estimated_min_lpa: Number(item?.estimated_min_lpa || 0),
    estimated_max_lpa: Number(item?.estimated_max_lpa || 0),
    fit_level: item?.fit_level || "Medium",
    salary_upside_note:
      item?.salary_upside_note ||
      "This is an estimated target salary range based on your profile and role fit.",
  }));
}

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
    goal_strategy:
      data?.goal_strategy ||
      "Goal-specific strategy is not available for this analysis.",
    salary_insight: {
      current_salary_lpa: Number(salaryInsight.current_salary_lpa || 0),
      market_min_lpa: Number(salaryInsight.market_min_lpa || 0),
      market_max_lpa: Number(salaryInsight.market_max_lpa || 0),
      salary_gap_lpa: salaryInsight.salary_gap_lpa || "Not available",
      confidence: salaryInsight.confidence || "Not available",
    },
    target_salary_insights: normalizeTargetSalaryInsights(
      data?.target_salary_insights
    ),
    target_roles: Array.isArray(data?.target_roles) ? data.target_roles : [],
    top_skill_gaps: Array.isArray(data?.top_skill_gaps)
      ? data.top_skill_gaps
      : [],
    skill_salary_impact:
      data?.skill_salary_impact && typeof data.skill_salary_impact === "object"
        ? data.skill_salary_impact
        : {},
    growth_paths: normalizeGrowthPaths(data?.growth_paths),
    why_recommendations: Array.isArray(data?.why_recommendations)
      ? data.why_recommendations
      : [],
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

function normalizeResumeResult(data: any): ResumeResult {
  return {
    target_role: data?.target_role || "Target role not available",
    resume_alignment: data?.resume_alignment || "Medium",
    alignment_summary:
      data?.alignment_summary || "Resume alignment summary is not available.",
    improved_profile_summary:
      data?.improved_profile_summary ||
      "Improved profile summary is not available.",
    improved_bullets: Array.isArray(data?.improved_bullets)
      ? data.improved_bullets.map((bullet: any) => ({
          original: bullet?.original || "Original bullet not provided",
          improved: bullet?.improved || "Improved bullet not provided",
          reason: bullet?.reason || "Reason not provided",
        }))
      : [],
    missing_keywords: Array.isArray(data?.missing_keywords)
      ? data.missing_keywords
      : [],
    resume_improvement_priorities: Array.isArray(
      data?.resume_improvement_priorities
    )
      ? data.resume_improvement_priorities
      : [],
    naukri_headline: data?.naukri_headline || "Naukri headline not available.",
    linkedin_summary:
      data?.linkedin_summary || "LinkedIn summary not available.",
    interview_positioning: Array.isArray(data?.interview_positioning)
      ? data.interview_positioning
      : [],
    disclaimer:
      data?.disclaimer ||
      "This is AI-generated resume guidance. Please review before using.",
  };
}

function normalizeLearningPlanResult(data: any): LearningPlanResult {
  return {
    target_role: data?.target_role || "Target role not available",
    learning_goal: data?.learning_goal || "Learning goal not available",
    readiness_level: data?.readiness_level || "Medium",
    readiness_summary:
      data?.readiness_summary ||
      "Readiness summary is not available for this plan.",
    revision_topics: Array.isArray(data?.revision_topics)
      ? data.revision_topics
      : [],
    new_skills_to_learn: Array.isArray(data?.new_skills_to_learn)
      ? data.new_skills_to_learn
      : [],
    project_suggestions: Array.isArray(data?.project_suggestions)
      ? data.project_suggestions.map((project: any) => ({
          project_name: project?.project_name || "Project suggestion",
          description:
            project?.description || "Project description is not available.",
          skills_covered: Array.isArray(project?.skills_covered)
            ? project.skills_covered
            : [],
          difficulty: project?.difficulty || "Medium",
          portfolio_value:
            project?.portfolio_value ||
            "This project can help demonstrate practical skills.",
        }))
      : [],
    interview_prep_topics: Array.isArray(data?.interview_prep_topics)
      ? data.interview_prep_topics
      : [],
    resource_recommendations: Array.isArray(data?.resource_recommendations)
      ? data.resource_recommendations.map((resource: any) => ({
          topic: resource?.topic || "Learning topic",
          resource_type:
            resource?.resource_type ||
            "YouTube / documentation / course / practice",
          what_to_search:
            resource?.what_to_search || "Search for relevant learning material",
          expected_outcome:
            resource?.expected_outcome ||
            "Understand and apply this topic practically.",
        }))
      : [],
    weekly_learning_plan:
      data?.weekly_learning_plan && typeof data.weekly_learning_plan === "object"
        ? data.weekly_learning_plan
        : {},
    job_readiness_checklist: Array.isArray(data?.job_readiness_checklist)
      ? data.job_readiness_checklist
      : [],
    disclaimer:
      data?.disclaimer ||
      "This is an AI-generated learning plan. Please adapt it to your time and target role.",
  };
}

function getFitScoreStyle(score: string) {
  const normalized = score.toLowerCase();

  if (normalized.includes("high")) return "bg-emerald-100 text-emerald-800";
  if (normalized.includes("low")) return "bg-rose-100 text-rose-800";

  return "bg-amber-100 text-amber-800";
}

function getAlignmentStyle(alignment: string) {
  const normalized = alignment.toLowerCase();

  if (normalized.includes("high")) return "bg-emerald-100 text-emerald-800";
  if (normalized.includes("low")) return "bg-rose-100 text-rose-800";

  return "bg-amber-100 text-amber-800";
}

function getReadinessStyle(readiness: string) {
  const normalized = readiness.toLowerCase();

  if (normalized.includes("high")) return "bg-emerald-100 text-emerald-800";
  if (normalized.includes("low")) return "bg-rose-100 text-rose-800";

  return "bg-amber-100 text-amber-800";
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

  const [activeView, setActiveView] = useState<
    "career" | "resume" | "learning"
  >("career");

  const [resumeText, setResumeText] = useState("");
  const [resumeTargetRole, setResumeTargetRole] = useState("");
  const [resumeResult, setResumeResult] = useState<ResumeResult | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  const [learningTargetRole, setLearningTargetRole] = useState("");
  const [learningResult, setLearningResult] =
    useState<LearningPlanResult | null>(null);
  const [learningLoading, setLearningLoading] = useState(false);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetResumeState = () => {
    setResumeText("");
    setResumeTargetRole("");
    setResumeResult(null);
    setResumeLoading(false);
  };

  const resetLearningState = () => {
    setLearningTargetRole("");
    setLearningResult(null);
    setLearningLoading(false);
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
    setActiveView("career");
    resetResumeState();
    resetLearningState();

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

      const safeResult = normalizeCareerResult(res.data);
      setResult(safeResult);

      if (safeResult.target_roles.length > 0) {
        setResumeTargetRole(safeResult.target_roles[0]);
        setLearningTargetRole(safeResult.target_roles[0]);
      }
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

  const allTargetRoles = result
    ? Array.from(
        new Set([
          ...result.target_roles,
          ...result.growth_paths.flatMap((path) => path.target_roles),
        ])
      )
    : [];

  const optimizeResume = async () => {
    if (!result) {
      alert("Please generate career analysis first.");
      return;
    }

    if (!resumeTargetRole.trim()) {
      alert("Please select or enter a target role.");
      return;
    }

    if (!resumeText.trim()) {
      alert("Please paste your resume text.");
      return;
    }

    if (resumeText.trim().length < 50) {
      alert("Please paste more resume details for better analysis.");
      return;
    }

    setResumeLoading(true);
    setResumeResult(null);

    const payload = {
      current_role: form.current_role.trim(),
      experience_years: Number(form.experience_years),
      city: form.city.trim(),
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      goal: form.goal,
      target_role: resumeTargetRole.trim(),
      resume_text: resumeText.trim(),
    };

    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/resume/optimize`,
        payload
      );

      setResumeResult(normalizeResumeResult(res.data));
    } catch (error: any) {
      console.error("Resume optimization failed:", error);
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Resume optimization failed. Please try again.";
      alert(message);
    } finally {
      setResumeLoading(false);
    }
  };

  const generateLearningPlan = async () => {
    if (!result) {
      alert("Please generate career analysis first.");
      return;
    }

    if (!learningTargetRole.trim()) {
      alert("Please select or enter a target role.");
      return;
    }

    setLearningLoading(true);
    setLearningResult(null);

    const payload = {
      current_role: form.current_role.trim(),
      experience_years: Number(form.experience_years),
      city: form.city.trim(),
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      goal: form.goal,
      target_role: learningTargetRole.trim(),
      skill_gaps: result.top_skill_gaps || [],
    };

    try {
      const res = await axios.post(`${apiBaseUrl}/api/learning/plan`, payload);
      setLearningResult(normalizeLearningPlanResult(res.data));
    } catch (error: any) {
      console.error("Learning plan generation failed:", error);
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Learning plan generation failed. Please try again.";
      alert(message);
    } finally {
      setLearningLoading(false);
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
            Find your salary gap and build your career execution plan.
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Analyze your profile, explore growth paths, optimize your resume,
            and generate a learning plan for your target role.
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
                    Fill the form and generate your career report. Resume
                    optimizer and learning plan will unlock after analysis.
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
                    Mapping your role, detecting growth paths, and creating a
                    goal-specific roadmap.
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-white p-3 shadow">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      onClick={() => setActiveView("career")}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        activeView === "career"
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Career Report
                    </button>

                    <button
                      onClick={() => setActiveView("resume")}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        activeView === "resume"
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Resume Optimizer
                    </button>

                    <button
                      onClick={() => setActiveView("learning")}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        activeView === "learning"
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Learning Plan
                    </button>
                  </div>
                </div>

                {activeView === "career" && (
                  <div className="space-y-6">
                    <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                      <div className="mb-4 flex flex-wrap gap-3">
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                          {result.role_cluster}
                        </span>
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                          {result.current_level} Level
                        </span>
                        <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
                          Goal: {form.goal}
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
                        <p className="mb-2 text-sm text-slate-500">
                          Salary Gap
                        </p>
                        <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                          {result.salary_insight.salary_gap_lpa}
                        </p>
                      </div>
                    </div>

                    {result.target_salary_insights.length > 0 && (
                      <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-slate-900">
                            Target Salary Potential
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            These are estimated salary ranges for your recommended
                            next roles based on your experience, city and role fit.
                          </p>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-3">
                          {result.target_salary_insights.map((item, index) => (
                            <div
                              key={`${item.target_role}-${index}`}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-base font-bold text-slate-900">
                                  {item.target_role}
                                </h4>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getFitScoreStyle(
                                    item.fit_level
                                  )}`}
                                >
                                  {item.fit_level} Fit
                                </span>
                              </div>

                              <p className="text-2xl font-bold text-slate-900">
                                ₹{item.estimated_min_lpa}L - ₹
                                {item.estimated_max_lpa}L
                              </p>

                              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Target range
                              </p>

                              <p className="mt-4 text-sm leading-6 text-slate-600">
                                {item.fit_level?.toLowerCase().includes("high")
                                  ? "Realistic adjacent move based on your profile."
                                  : item.fit_level?.toLowerCase().includes("medium")
                                  ? "Possible transition path. Close key skill gaps first."
                                  : "Stretch path. Requires stronger preparation first."}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="rounded-3xl bg-indigo-50 p-5 shadow-sm sm:p-6">
                      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-700">
                        Goal-Specific Strategy
                      </p>
                      <p className="text-sm leading-6 text-indigo-950 sm:text-base">
                        {result.goal_strategy}
                      </p>
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
                      <h3 className="mb-2 text-xl font-bold text-slate-900">
                        Possible Growth Paths
                      </h3>
                      <p className="mb-4 text-sm leading-6 text-slate-500">
                        These are possible directions based on your role, skills
                        and selected goal.
                      </p>

                      {result.growth_paths.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          Growth paths are not available.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {result.growth_paths.map((path, index) => (
                            <div
                              key={index}
                              className="rounded-2xl border border-slate-200 p-4"
                            >
                              <div className="mb-3 flex flex-wrap items-center gap-2">
                                <h4 className="text-lg font-bold text-slate-900">
                                  {path.path_name}
                                </h4>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getFitScoreStyle(
                                    path.fit_score
                                  )}`}
                                >
                                  {path.fit_score} Fit
                                </span>
                              </div>

                              <p className="mb-4 text-sm leading-6 text-slate-600">
                                {path.why_it_fits}
                              </p>

                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <p className="mb-2 text-sm font-semibold text-slate-900">
                                    Target Roles
                                  </p>
                                  {path.target_roles.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                      No roles available.
                                    </p>
                                  ) : (
                                    <ul className="space-y-2">
                                      {path.target_roles.map(
                                        (role, roleIndex) => (
                                          <li
                                            key={roleIndex}
                                            className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
                                          >
                                            {role}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                                </div>

                                <div>
                                  <p className="mb-2 text-sm font-semibold text-slate-900">
                                    Skills to Build
                                  </p>
                                  {path.skills_to_build.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                      No skills available.
                                    </p>
                                  ) : (
                                    <div className="flex flex-wrap gap-2">
                                      {path.skills_to_build.map(
                                        (skill, skillIndex) => (
                                          <span
                                            key={skillIndex}
                                            className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                                          >
                                            {skill}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
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

                    <div className="rounded-3xl bg-slate-900 p-5 text-white shadow sm:p-6">
                      <h3 className="mb-4 text-xl font-bold">
                        Why These Recommendations?
                      </h3>

                      {result.why_recommendations.length === 0 ? (
                        <p className="text-sm text-slate-300">
                          Explanation is not available.
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {result.why_recommendations.map((reason, index) => (
                            <li
                              key={index}
                              className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-100"
                            >
                              {reason}
                            </li>
                          ))}
                        </ul>
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-indigo-50 p-5 shadow-sm sm:p-6">
                        <h3 className="mb-2 text-xl font-bold text-indigo-950">
                          Improve your resume
                        </h3>
                        <p className="mb-4 text-sm leading-6 text-indigo-900">
                          Rewrite your profile summary, resume bullets, Naukri
                          headline and LinkedIn summary for your target role.
                        </p>
                        <button
                          onClick={() => setActiveView("resume")}
                          className="rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white transition hover:bg-indigo-800"
                        >
                          Go to Resume Optimizer
                        </button>
                      </div>

                      <div className="rounded-3xl bg-cyan-50 p-5 shadow-sm sm:p-6">
                        <h3 className="mb-2 text-xl font-bold text-cyan-950">
                          Build your learning plan
                        </h3>
                        <p className="mb-4 text-sm leading-6 text-cyan-900">
                          Get revision topics, new skills, project ideas,
                          interview prep and resource guidance.
                        </p>
                        <button
                          onClick={() => setActiveView("learning")}
                          className="rounded-xl bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800"
                        >
                          Go to Learning Plan
                        </button>
                      </div>
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

                {activeView === "resume" && (
                  <div className="space-y-6">
                    <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            Resume Optimizer
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            Paste your resume and optimize it for a specific
                            target role.
                          </p>
                        </div>

                        <button
                          onClick={() => setActiveView("career")}
                          className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                        >
                          Back to Career Report
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Target Role</label>
                          {allTargetRoles.length > 0 ? (
                            <select
                              className={inputClass}
                              value={resumeTargetRole}
                              onChange={(e) =>
                                setResumeTargetRole(e.target.value)
                              }
                            >
                              {allTargetRoles.map((role, index) => (
                                <option key={index} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              className={inputClass}
                              placeholder="e.g. Senior Backend Engineer"
                              value={resumeTargetRole}
                              onChange={(e) =>
                                setResumeTargetRole(e.target.value)
                              }
                            />
                          )}
                        </div>

                        <div>
                          <label className={labelClass}>
                            Paste Resume Text
                          </label>
                          <textarea
                            className={textAreaClass}
                            placeholder="Paste your resume text here. Include summary, skills, work experience and projects for best results."
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                          />
                          <p className="mt-1 text-xs text-slate-500">
                            For privacy, this MVP does not store your resume
                            text.
                          </p>
                        </div>

                        <button
                          onClick={optimizeResume}
                          disabled={resumeLoading}
                          className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                          {resumeLoading
                            ? "Optimizing resume..."
                            : "Generate Resume Suggestions"}
                        </button>
                      </div>
                    </div>

                    {resumeLoading && (
                      <div className="rounded-3xl bg-white p-6 text-center shadow">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950"></div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Optimizing your resume...
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Rewriting bullets, finding missing keywords and
                          preparing your Naukri/LinkedIn positioning.
                        </p>
                      </div>
                    )}

                    {resumeResult && (
                      <div className="space-y-6">
                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-bold text-slate-900">
                              Resume Optimization Result
                            </h3>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getAlignmentStyle(
                                resumeResult.resume_alignment
                              )}`}
                            >
                              {resumeResult.resume_alignment} Alignment
                            </span>
                          </div>

                          <p className="text-sm leading-6 text-slate-600">
                            {resumeResult.alignment_summary}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <h3 className="mb-3 text-xl font-bold text-slate-900">
                            Improved Profile Summary
                          </h3>
                          <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                            {resumeResult.improved_profile_summary}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <h3 className="mb-4 text-xl font-bold text-slate-900">
                            Improved Resume Bullets
                          </h3>

                          {resumeResult.improved_bullets.length === 0 ? (
                            <p className="text-sm text-slate-500">
                              No bullet improvements available.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {resumeResult.improved_bullets.map(
                                (bullet, index) => (
                                  <div
                                    key={index}
                                    className="rounded-2xl border border-slate-200 p-4"
                                  >
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                      Original / Weak Area
                                    </p>
                                    <p className="mb-4 text-sm leading-6 text-slate-600">
                                      {bullet.original}
                                    </p>

                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                      Improved Bullet
                                    </p>
                                    <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                                      {bullet.improved}
                                    </p>

                                    <p className="text-xs leading-5 text-slate-500">
                                      <span className="font-semibold">
                                        Why better:
                                      </span>{" "}
                                      {bullet.reason}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                            <h3 className="mb-4 text-xl font-bold text-slate-900">
                              Missing Keywords
                            </h3>

                            {resumeResult.missing_keywords.length === 0 ? (
                              <p className="text-sm text-slate-500">
                                No missing keywords available.
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {resumeResult.missing_keywords.map(
                                  (keyword, index) => (
                                    <span
                                      key={index}
                                      className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                                    >
                                      {keyword}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                            <h3 className="mb-4 text-xl font-bold text-slate-900">
                              Improvement Priorities
                            </h3>

                            {resumeResult.resume_improvement_priorities
                              .length === 0 ? (
                              <p className="text-sm text-slate-500">
                                No priorities available.
                              </p>
                            ) : (
                              <ul className="space-y-2">
                                {resumeResult.resume_improvement_priorities.map(
                                  (priority, index) => (
                                    <li
                                      key={index}
                                      className="text-sm leading-6 text-slate-700"
                                    >
                                      • {priority}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <h3 className="mb-3 text-xl font-bold text-slate-900">
                            Naukri Profile Headline
                          </h3>
                          <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                            {resumeResult.naukri_headline}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <h3 className="mb-3 text-xl font-bold text-slate-900">
                            LinkedIn About Summary
                          </h3>
                          <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                            {resumeResult.linkedin_summary}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <h3 className="mb-4 text-xl font-bold text-slate-900">
                            Interview Positioning
                          </h3>

                          {resumeResult.interview_positioning.length === 0 ? (
                            <p className="text-sm text-slate-500">
                              Interview positioning is not available.
                            </p>
                          ) : (
                            <ul className="space-y-3">
                              {resumeResult.interview_positioning.map(
                                (item, index) => (
                                  <li
                                    key={index}
                                    className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                                  >
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          )}

                          <p className="mt-4 text-xs leading-5 text-slate-500">
                            {resumeResult.disclaimer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeView === "learning" && (
                  <div className="space-y-6">
                    <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            Learning & Upskilling Plan
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            Generate revision topics, new skills, projects,
                            interview prep and resource guidance for your target
                            role.
                          </p>
                        </div>

                        <button
                          onClick={() => setActiveView("career")}
                          className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                        >
                          Back to Career Report
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Target Role</label>
                          {allTargetRoles.length > 0 ? (
                            <select
                              className={inputClass}
                              value={learningTargetRole}
                              onChange={(e) =>
                                setLearningTargetRole(e.target.value)
                              }
                            >
                              {allTargetRoles.map((role, index) => (
                                <option key={index} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              className={inputClass}
                              placeholder="e.g. Senior Backend Engineer"
                              value={learningTargetRole}
                              onChange={(e) =>
                                setLearningTargetRole(e.target.value)
                              }
                            />
                          )}
                        </div>

                        <button
                          onClick={generateLearningPlan}
                          disabled={learningLoading}
                          className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                          {learningLoading
                            ? "Generating learning plan..."
                            : "Generate Learning Plan"}
                        </button>
                      </div>
                    </div>

                    {learningLoading && (
                      <div className="rounded-3xl bg-white p-6 text-center shadow">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950"></div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Creating your learning plan...
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Preparing revision topics, new skills, projects and
                          interview prep for your target role.
                        </p>
                      </div>
                    )}

                    {learningResult && (
                      <div className="space-y-6">
                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-bold text-slate-900">
                              Learning Plan Result
                            </h3>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getReadinessStyle(
                                learningResult.readiness_level
                              )}`}
                            >
                              {learningResult.readiness_level} Readiness
                            </span>
                          </div>

                          <p className="text-sm leading-6 text-slate-600">
                            {learningResult.readiness_summary}
                          </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                            <h3 className="mb-4 text-xl font-bold text-slate-900">
                              Revision Topics
                            </h3>

                            {learningResult.revision_topics.length === 0 ? (
                              <p className="text-sm text-slate-500">
                                No revision topics available.
                              </p>
                            ) : (
                              <ul className="space-y-2">
                                {learningResult.revision_topics.map(
                                  (topic, index) => (
                                    <li
                                      key={index}
                                      className="text-sm leading-6 text-slate-700"
                                    >
                                      • {topic}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>

                          <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                            <h3 className="mb-4 text-xl font-bold text-slate-900">
                              New Skills to Learn
                            </h3>

                            {learningResult.new_skills_to_learn.length === 0 ? (
                              <p className="text-sm text-slate-500">
                                No new skills available.
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {learningResult.new_skills_to_learn.map(
                                  (skill, index) => (
                                    <span
                                      key={index}
                                      className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <h3 className="mb-4 text-xl font-bold text-slate-900">
                            Project Suggestions
                          </h3>

                          {learningResult.project_suggestions.length === 0 ? (
                            <p className="text-sm text-slate-500">
                              No project suggestions available.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {learningResult.project_suggestions.map(
                                (project, index) => (
                                  <div
                                    key={index}
                                    className="rounded-2xl border border-slate-200 p-4"
                                  >
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                      <h4 className="text-lg font-bold text-slate-900">
                                        {project.project_name}
                                      </h4>
                                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                                        {project.difficulty}
                                      </span>
                                    </div>

                                    <p className="mb-3 text-sm leading-6 text-slate-600">
                                      {project.description}
                                    </p>

                                    <p className="mb-2 text-sm font-semibold text-slate-900">
                                      Skills covered
                                    </p>

                                    <div className="mb-3 flex flex-wrap gap-2">
                                      {project.skills_covered.map(
                                        (skill, skillIndex) => (
                                          <span
                                            key={skillIndex}
                                            className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                                          >
                                            {skill}
                                          </span>
                                        )
                                      )}
                                    </div>

                                    <p className="text-sm leading-6 text-slate-600">
                                      <span className="font-semibold">
                                        Portfolio value:
                                      </span>{" "}
                                      {project.portfolio_value}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <h3 className="mb-4 text-xl font-bold text-slate-900">
                            Interview Prep Topics
                          </h3>

                          {learningResult.interview_prep_topics.length === 0 ? (
                            <p className="text-sm text-slate-500">
                              No interview topics available.
                            </p>
                          ) : (
                            <ul className="space-y-2">
                              {learningResult.interview_prep_topics.map(
                                (topic, index) => (
                                  <li
                                    key={index}
                                    className="text-sm leading-6 text-slate-700"
                                  >
                                    • {topic}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <h3 className="mb-4 text-xl font-bold text-slate-900">
                            Resource Guidance
                          </h3>

                          {learningResult.resource_recommendations.length ===
                          0 ? (
                            <p className="text-sm text-slate-500">
                              No resource guidance available.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {learningResult.resource_recommendations.map(
                                (resource, index) => (
                                  <div
                                    key={index}
                                    className="rounded-2xl border border-slate-200 p-4"
                                  >
                                    <p className="font-bold text-slate-900">
                                      {resource.topic}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                      {resource.resource_type}
                                    </p>
                                    <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                                      Search: {resource.what_to_search}
                                    </p>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                      <span className="font-semibold">
                                        Expected outcome:
                                      </span>{" "}
                                      {resource.expected_outcome}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow sm:p-6">
                          <h3 className="mb-4 text-xl font-bold text-slate-900">
                            Weekly Learning Plan
                          </h3>

                          {Object.keys(learningResult.weekly_learning_plan)
                            .length === 0 ? (
                            <p className="text-sm text-slate-500">
                              Weekly learning plan is not available.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {Object.entries(
                                learningResult.weekly_learning_plan
                              ).map(([week, tasks]) => (
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
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="rounded-3xl bg-emerald-50 p-5 shadow-sm sm:p-6">
                          <h3 className="mb-4 text-xl font-bold text-emerald-950">
                            Job Readiness Checklist
                          </h3>

                          {learningResult.job_readiness_checklist.length ===
                          0 ? (
                            <p className="text-sm text-emerald-900">
                              Checklist is not available.
                            </p>
                          ) : (
                            <ul className="space-y-2">
                              {learningResult.job_readiness_checklist.map(
                                (item, index) => (
                                  <li
                                    key={index}
                                    className="text-sm leading-6 text-emerald-900"
                                  >
                                    ✅ {item}
                                  </li>
                                )
                              )}
                            </ul>
                          )}

                          <p className="mt-4 text-xs leading-5 text-emerald-800">
                            {learningResult.disclaimer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}