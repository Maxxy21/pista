import { Sparkles, Zap, Target, MessageSquareText, BarChart3, Shield } from "lucide-react";

export const features = [
    {
        title: "AI-Powered Analysis",
        description:
            "GPT-4 evaluates your pitch across problem-solution fit, business model, team strength, and presentation quality.",
        icon: Sparkles,
    },
    {
        title: "Instant Feedback",
        description:
            "No waiting for human reviewers. Get structured, investor-grade feedback in under a minute.",
        icon: Zap,
    },
    {
        title: "Dimensional Scoring",
        description:
            "Scores across 4 weighted dimensions with sub-aspect breakdowns, so you know exactly where to improve.",
        icon: Target,
    },
    {
        title: "Investor Q&A Prep",
        description:
            "Generate the tough questions investors will ask based on gaps in your pitch, then practice your answers.",
        icon: MessageSquareText,
    },
    {
        title: "Visual Analytics",
        description:
            "Radar charts and score breakdowns make it easy to track improvements across multiple pitch iterations.",
        icon: BarChart3,
    },
    {
        title: "Risk Assessment",
        description:
            "Get a clear-eyed view of investment viability, key risks, and mitigation strategies for your startup.",
        icon: Shield,
    },
];

export const steps = [
    {
        title: "Submit Your Pitch",
        description:
            "Paste your pitch text, upload a file, or record audio. Pista handles all three.",
    },
    {
        title: "AI Evaluates",
        description:
            "Our model scores your pitch against a rubric used by real investors, in under 60 seconds.",
    },
    {
        title: "Review & Iterate",
        description:
            "Get detailed scores, specific feedback, and investor questions. Refine and resubmit.",
    },
];

export const stats = [
    { value: "4", label: "Evaluation dimensions" },
    { value: "<60s", label: "Time to feedback" },
    { value: "GPT-4", label: "Powered by" },
    { value: "3+", label: "Input formats" },
];

export const animations = {
    fadeIn: {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    },
    staggerChildren: {
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
};
