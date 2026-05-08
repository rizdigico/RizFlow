import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { SITE_URL, SEO_DEFAULTS } from "@/lib/constants";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  BoltIcon,
  ClockIcon,
  LightBulbIcon,
  ArrowPathIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// ── Types ──────────────────────────────────────────────────────────────────

type QuestionType = "select" | "selectWithOther" | "text";

interface SelectOption {
  value: string;
  label: string;
}

interface Question {
  id: string;
  type: QuestionType;
  label: string;
  description: string;
  placeholder?: string;
  options?: SelectOption[];
  optional?: boolean;
}

interface AIResult {
  score: number;
  level: string;
  estimatedSavings: string;
  topAutomations: string[];
  recommendations: string[];
  impactSummary: string;
}

// ── Questions (10 total) ───────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: "industry",
    type: "selectWithOther",
    label: "What type of business do you run?",
    description:
      "This helps us give you industry-specific automation recommendations.",
    options: [
      { value: "retail", label: "Retail / E-commerce" },
      { value: "food", label: "F&B / Restaurant" },
      {
        value: "services",
        label: "Professional Services (Law, Accounting, Consulting)",
      },
      { value: "health", label: "Healthcare / Clinic / Wellness" },
      { value: "construction", label: "Construction / Trades" },
      { value: "education", label: "Education / Training" },
      { value: "realestate", label: "Real Estate / Property" },
      { value: "logistics", label: "Logistics / Transport" },
      { value: "tech", label: "Tech / SaaS" },
    ],
  },
  {
    id: "teamSize",
    type: "select",
    label: "How big is your team?",
    description: "Including yourself and any part-time staff.",
    options: [
      { value: "solo", label: "Just me (solo)" },
      { value: "small", label: "2–5 people" },
      { value: "medium", label: "6–15 people" },
      { value: "large", label: "16–30 people" },
      { value: "bigger", label: "30+ people" },
    ],
  },
  {
    id: "biggestPain",
    type: "text",
    label: "What's your biggest daily headache?",
    description:
      "The one thing that eats up your time or causes the most friction every day.",
    placeholder:
      "e.g. Chasing invoice payments, manual order entry, customer follow-ups...",
  },
  {
    id: "manualHours",
    type: "select",
    label: "How many hours/week does your team spend on repetitive tasks?",
    description:
      "Data entry, invoicing, scheduling, email sorting, report generation, etc.",
    options: [
      { value: "under5", label: "Less than 5 hours" },
      { value: "5to15", label: "5–15 hours" },
      { value: "15to30", label: "15–30 hours" },
      { value: "30plus", label: "30+ hours (it's a lot)" },
    ],
  },
  {
    id: "currentTools",
    type: "text",
    label: "What tools/software do you use to run your business?",
    description:
      "List the main ones — CRM, spreadsheets, invoicing, project management, etc.",
    placeholder: "e.g. Google Sheets, Xero, WhatsApp Business, Trello...",
  },
  {
    id: "aiToolsExperience",
    type: "select",
    label: "Have you tried any AI tools in your business?",
    description: "ChatGPT, Copilot, Zapier AI, or any AI-powered automation.",
    options: [
      { value: "none", label: "Nope, haven't tried any" },
      { value: "dabbled", label: "Played around with ChatGPT a bit" },
      { value: "some", label: "Using a few AI tools regularly" },
      { value: "deep", label: "AI is already part of my workflows" },
    ],
  },
  {
    id: "aiToolsUsed",
    type: "text",
    label: "Which AI or automation tools are you currently using?",
    description:
      "Even if it's just ChatGPT for emails — tell us what you've set up so far.",
    placeholder:
      "e.g. ChatGPT for emails, Zapier for lead alerts, Calendly for scheduling...",
  },
  {
    id: "automateFirst",
    type: "text",
    label: "If you could automate one thing tomorrow, what would it be?",
    description: "The task you'd hand off to AI first if you could.",
    placeholder:
      "e.g. Customer follow-ups, invoice generation, inventory tracking...",
  },
  {
    id: "biggestGoal",
    type: "text",
    label: "What's your #1 goal for the next 6 months?",
    description: "What would move the needle most for your business?",
    placeholder:
      "e.g. Double revenue, reduce costs by 30%, scale to 2x customers...",
  },
  {
    id: "automationBlocker",
    type: "select",
    label: "What's holding you back from automating more?",
    description:
      "The main reason you haven't gone all-in on AI automation yet.",
    options: [
      {
        value: "dontKnowHow",
        label: "Don't know where to start or what's possible",
      },
      {
        value: "noTime",
        label: "No time to set it up — too busy running the business",
      },
      { value: "cost", label: "Worried it'll be too expensive" },
      {
        value: "triedFailed",
        label: "Tried before and it didn't work / was too complicated",
      },
      {
        value: "dontNeed",
        label: "Not sure AI is relevant for my type of business",
      },
    ],
  },
];

const CAL_LINK = "https://cal.com/aariz-a/ai-audit";

// ── Component ─────────────────────────────────────────────────────────────

type Phase = "quiz" | "analyzing" | "results" | "error";

export function ReadinessScore() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [textInput, setTextInput] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [result, setResult] = useState<AIResult | null>(null);

  // Pre-fill text input when going back to a text question with a previous answer
  const goToQuestion = useCallback(
    (index: number) => {
      setCurrentQ(index);
      setShowOtherInput(false);
      setOtherText("");
      const q = QUESTIONS[index];
      if (q.type === "text" && answers[q.id]) {
        setTextInput(answers[q.id]);
      } else if (
        q.type === "selectWithOther" &&
        answers[q.id] &&
        !q.options?.some((o) => o.value === answers[q.id])
      ) {
        setShowOtherInput(true);
        setOtherText(answers[q.id]);
      } else {
        setTextInput("");
      }
    },
    [answers],
  );

  const handleSelectAnswer = useCallback(
    (questionId: string, value: string) => {
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);
      if (currentQ < QUESTIONS.length - 1) {
        setTimeout(() => goToQuestion(currentQ + 1), 300);
      } else {
        submitForAnalysis(newAnswers);
      }
    },
    [currentQ, answers, goToQuestion],
  );

  const handleOtherSelect = () => {
    setShowOtherInput(true);
  };

  const handleOtherSubmit = useCallback(() => {
    if (!otherText.trim()) return;
    const questionId = QUESTIONS[currentQ].id;
    const newAnswers = { ...answers, [questionId]: otherText.trim() };
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => goToQuestion(currentQ + 1), 300);
    } else {
      submitForAnalysis(newAnswers);
    }
  }, [currentQ, answers, otherText, goToQuestion]);

  const handleTextSubmit = useCallback(() => {
    const val = textInput.trim() || "Prefer not to say";
    const questionId = QUESTIONS[currentQ].id;
    const newAnswers = { ...answers, [questionId]: val };
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => goToQuestion(currentQ + 1), 300);
    } else {
      submitForAnalysis(newAnswers);
    }
  }, [currentQ, answers, textInput, goToQuestion]);

  const submitForAnalysis = async (finalAnswers: Record<string, string>) => {
    setPhase("analyzing");
    try {
      const res = await fetch("/api/ai-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      if (data.score && data.level) {
        setResult(data);
        setPhase("results");
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      setPhase("error");
    }
  };

  const handleRestart = () => {
    setPhase("quiz");
    setCurrentQ(0);
    setAnswers({});
    setTextInput("");
    setShowOtherInput(false);
    setOtherText("");
    setResult(null);
  };

  const handleBack = () => {
    if (currentQ > 0) {
      goToQuestion(currentQ - 1);
    }
  };

  const question = QUESTIONS[currentQ];
  const progress =
    ((currentQ + (phase === "quiz" ? 0 : QUESTIONS.length)) /
      QUESTIONS.length) *
    100;
  const hasPreviousAnswer = currentQ > 0;

  const getLevelColor = (level: string) => {
    if (level.includes("Ready"))
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/30",
      };
    if (level.includes("High"))
      return { text: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/30" };
    if (level.includes("Getting"))
      return { text: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" };
    if (level.includes("Early"))
      return {
        text: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30",
      };
    return {
      text: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/30",
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "#06B6D4";
    if (score >= 45) return "#22D3EE";
    return "#F59E0B";
  };

  // Check if a select option was previously chosen
  const isOptionSelected = (questionId: string, value: string) => {
    return answers[questionId] === value;
  };

  return (
    <>
      <Helmet>
        <title>
          AI Readiness Score — Find Out How Much AI Can Transform Your Business
          | RizFlow
        </title>
        <meta
          name="description"
          content="Score your business AI readiness in 60 seconds. Get personalized automation recommendations and see how many hours AI can save you each week."
        />
        <link rel="canonical" href={`${SITE_URL}/ai-score`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/ai-score`} />
        <meta
          property="og:title"
          content="AI Readiness Score — How Ready Is Your Business for AI?"
        />
        <meta
          property="og:description"
          content="Score your business AI readiness in 60 seconds. Free assessment with personalized automation recommendations."
        />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="AI Readiness Score — How Ready Is Your Business for AI?"
        />
        <meta
          name="twitter:description"
          content="Score your business AI readiness in 60 seconds. Free assessment with personalized automation recommendations."
        />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
      </Helmet>

      <section className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-[#050A14] bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>

        <Container className="relative z-10">
          <AnimatePresence mode="wait">
            {/* ── Quiz Phase ── */}
            {phase === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-sm border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    Free AI Assessment
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                    Score Your AI Readiness
                  </h1>
                  <p className="text-lg text-slate-400 max-w-lg mx-auto">
                    {QUESTIONS.length} questions. 2 minutes. Get personalized
                    recommendations for <em>your</em> business.
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
                    <span>
                      Question {currentQ + 1} of {QUESTIONS.length}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 w-full overflow-hidden border border-white/5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Question card */}
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0A0F1A]/95 backdrop-blur-3xl border border-teal-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,229,255,0.1)] relative"
                >
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

                  <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-sm animate-pulse" />
                    Question {currentQ + 1}
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 font-heading">
                    {question.label}
                  </h2>
                  <p className="text-sm text-slate-400 mb-6">
                    {question.description}
                  </p>

                  {/* Select with "Other" option */}
                  {(question.type === "select" ||
                    question.type === "selectWithOther") &&
                    question.options &&
                    !showOtherInput && (
                      <div className="space-y-3">
                        {question.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleSelectAnswer(question.id, option.value)
                            }
                            className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 group ${
                              isOptionSelected(question.id, option.value)
                                ? "border-teal-500/70 bg-teal-500/15 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                                : "border-white/10 bg-white/5 hover:border-teal-500/50 hover:bg-teal-500/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.1)]"
                            }`}
                          >
                            <span
                              className={`font-medium ${isOptionSelected(question.id, option.value) ? "text-teal-300" : "text-white group-hover:text-teal-300 transition-colors"}`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                        {question.type === "selectWithOther" && (
                          <button
                            onClick={handleOtherSelect}
                            className="w-full text-left px-5 py-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:border-teal-500/50 hover:bg-teal-500/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all duration-200 group"
                          >
                            <span className="text-slate-400 group-hover:text-teal-300 transition-colors font-medium">
                              Other — I'll type mine
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                  {/* "Other" text input */}
                  {showOtherInput && (
                    <div className="space-y-4">
                      <textarea
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        placeholder="What industry or type of business are you in?"
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:bg-teal-500/5 focus:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all font-medium resize-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleOtherSubmit();
                          }
                        }}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowOtherInput(false);
                            setOtherText("");
                          }}
                          className="px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-slate-400 font-semibold hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                        >
                          <ArrowLeftIcon className="w-4 h-4" />
                          Back to options
                        </button>
                        <button
                          onClick={handleOtherSubmit}
                          disabled={!otherText.trim()}
                          className="flex-1 px-5 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                        >
                          Continue
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Text input questions */}
                  {question.type === "text" && (
                    <div className="space-y-4">
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={question.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:bg-teal-500/5 focus:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all font-medium resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleTextSubmit();
                          }
                        }}
                      />
                      <button
                        onClick={handleTextSubmit}
                        className="w-full px-5 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all flex items-center justify-center gap-2"
                      >
                        Continue
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-slate-600 font-mono text-center">
                        Press Enter to continue — detailed answers = better
                        recommendations
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Back button */}
                {hasPreviousAnswer && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleBack}
                      className="text-sm text-slate-500 hover:text-teal-400 transition-colors font-mono inline-flex items-center gap-1.5"
                    >
                      <ArrowLeftIcon className="w-3.5 h-3.5" />
                      Go back to change answer
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Analyzing Phase ── */}
            {phase === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-lg mx-auto text-center"
              >
                <div className="bg-[#0A0F1A]/95 backdrop-blur-3xl border border-teal-500/30 rounded-2xl p-10 shadow-[0_0_30px_rgba(0,229,255,0.1)] relative">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full border-2 border-teal-500/30 border-t-teal-400 animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-heading">
                    Analyzing Your Business...
                  </h2>
                  <p className="text-slate-400 font-mono text-sm">
                    <span className="text-teal-400">&gt;</span> Mapping{" "}
                    {answers.industry || "your industry"} automation
                    opportunities
                    <br />
                    <span className="text-teal-400">&gt;</span> Scoring your
                    current tool stack & workflows
                    <br />
                    <span className="text-teal-400">&gt;</span> Building
                    personalized recommendations
                  </p>
                  <div className="mt-6 flex justify-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-4 font-mono">
                    This takes about 10 seconds
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Error Phase ── */}
            {phase === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto text-center"
              >
                <div className="bg-[#0A0F1A]/95 backdrop-blur-3xl border border-amber-500/30 rounded-2xl p-10 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                  <ExclamationTriangleIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-3 font-heading">
                    AI Analysis Timeout
                  </h2>
                  <p className="text-slate-400 mb-6">
                    The AI couldn't finish analyzing your answers in time. This
                    is rare — let's try again.
                  </p>
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Results Phase ── */}
            {phase === "results" && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-sm border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    Assessment Complete
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-3 drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                    Your AI Readiness Score
                  </h1>
                </div>

                <div className="max-w-md mx-auto mb-10 bg-[#0A0F1A] rounded-2xl p-8 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-teal-500/20 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                  <div className="relative z-10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2,
                      }}
                      className="mb-4"
                    >
                      <span
                        className="text-7xl font-bold font-mono drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                        style={{ color: getScoreColor(result.score) }}
                      >
                        {result.score}
                      </span>
                      <span className="text-2xl text-slate-500 font-mono">
                        /100
                      </span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm border ${getLevelColor(result.level).bg} ${getLevelColor(result.level).text} text-sm font-bold font-mono uppercase tracking-widest`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {result.level}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-6 p-4 rounded-xl border border-teal-500/30 bg-teal-500/5"
                    >
                      <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-1">
                        Estimated Weekly Savings
                      </p>
                      <p className="text-2xl font-bold text-white font-mono">
                        {result.estimatedSavings}
                      </p>
                    </motion.div>
                    {result.impactSummary && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="mt-4 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5"
                      >
                        <p className="text-sm text-slate-300 italic">
                          "{result.impactSummary}"
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
                  <div className="bg-[#0A0F1A] rounded-xl p-6 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-teal-500/20 relative overflow-hidden group">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <div className="relative z-10">
                      <p className="text-[10px] text-teal-400 font-bold font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BoltIcon className="w-3.5 h-3.5" />
                        Top Automations for You
                      </p>
                      <ul className="space-y-3">
                        {result.topAutomations.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                            className="flex items-start gap-2 text-sm text-slate-300"
                          >
                            <CheckCircleIcon className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-[#0A0F1A] rounded-xl p-6 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-teal-500/20 relative overflow-hidden group">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <div className="relative z-10">
                      <p className="text-[10px] text-teal-400 font-bold font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                        <LightBulbIcon className="w-3.5 h-3.5" />
                        Your Personalized Roadmap
                      </p>
                      <ul className="space-y-3">
                        {result.recommendations.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.0 + i * 0.1 }}
                            className="flex items-start gap-2 text-sm text-slate-300"
                          >
                            <ArrowRightIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="max-w-xl mx-auto text-center"
                >
                  <div className="bg-[#0A0F1A]/95 backdrop-blur-3xl border border-teal-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,229,255,0.15)] relative">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
                    <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                      <SparklesIcon className="w-3.5 h-3.5" />
                      Next Step
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-3 font-heading">
                      Get your full AI automation roadmap
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Book a free 30-minute discovery audit. We'll map out
                      exactly what AI can automate for <em>your</em> business —
                      no pitch, just practical advice.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href={CAL_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 h-13 px-8 text-lg font-bold bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 bg-[length:200%_auto] animate-gradient-x text-white rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all active:scale-[0.98]"
                      >
                        Book Free AI Audit
                        <ArrowRightIcon className="w-5 h-5" />
                      </a>
                      <a
                        href="/demo"
                        className="inline-flex items-center justify-center gap-2 h-13 px-8 text-lg font-semibold border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20 transition-all rounded-xl"
                      >
                        Try Live Demo
                      </a>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 font-mono">
                      &gt; 30 min call · zero pitch · personalized roadmap
                    </p>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="mt-6 text-sm text-slate-500 hover:text-teal-400 transition-colors font-mono inline-flex items-center gap-1.5"
                  >
                    <ArrowPathIcon className="w-3.5 h-3.5" />
                    Retake assessment
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </section>
    </>
  );
}
