import { ArrowRight, CheckCircle2, Sparkles, Target, Zap, MessageSquareText, Award } from "lucide-react";

export const features = [
    {
        title: "AI-Powered Analysis",
        description:
            "AI evaluates your pitch content and structure, providing feedback on key areas like clarity, flow, and business fundamentals.",
        icon: Sparkles,
    },
    {
        title: "Fast Feedback",
        description:
            "Get feedback within minutes of submitting your pitch. No waiting for human reviewers or scheduling calls.",
        icon: Zap,
    },
    {
        title: "Business-Focused Review",
        description:
            "Receive feedback on essential pitch elements including problem definition, solution clarity, market opportunity, and business model.",
        icon: Award,
    },
    {
        title: "Detailed Scoring",
        description:
            "Get scores across different pitch dimensions with specific feedback on what works well and what could be improved.",
        icon: Target,
    },
    {
        title: "Investor Questions",
        description:
            "Get potential investor questions based on your pitch content to help you prepare for real pitch meetings.",
        icon: MessageSquareText,
    },
    {
        title: "Text Input",
        description:
            "Submit your pitch by typing directly or uploading a text file. Simple and straightforward process.",
        icon: CheckCircle2,
    },
];

export const steps = [
    {
        title: "Submit Your Pitch",
        description:
            "Type your pitch directly or upload a text file. The system processes text-based pitch content.",
    },
    {
        title: "AI Analysis",
        description:
            "AI analyzes your pitch content for structure, clarity, and key business elements like problem-solution fit and market opportunity.",
    },
    {
        title: "Review Feedback",
        description:
            "Get scores and specific feedback on different aspects of your pitch, plus potential investor questions to consider.",
    },
];

export const animations = {
    fadeIn: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    },
    staggerChildren: {
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    }
}; 