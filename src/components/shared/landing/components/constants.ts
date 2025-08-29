import { ArrowRight, CheckCircle2, Sparkles, Target, Zap, MessageSquareText, Award } from "lucide-react";

export const features = [
    {
        title: "AI-Powered Analysis",
        description:
            "Our advanced AI evaluates your pitch across multiple dimensions, providing comprehensive feedback that highlights strengths and areas for improvement.",
        icon: Sparkles,
    },
    {
        title: "Instant Feedback",
        description:
            "Get detailed feedback in minutes, not days. Make improvements in real-time and iterate quickly on your pitch deck.",
        icon: Zap,
    },
    {
        title: "Expert Insights",
        description:
            "Our AI is trained on thousands of successful pitch decks and investor feedback to provide industry-specific recommendations.",
        icon: Award,
    },
    {
        title: "Comprehensive Evaluation",
        description:
            "Receive scores and detailed analysis on your problem-solution fit, business model, team capabilities, and presentation quality.",
        icon: Target,
    },
    {
        title: "Follow-up Q&A",
        description:
            "Get AI-generated questions that investors might ask and practice your responses for a more complete pitch evaluation.",
        icon: MessageSquareText,
    },
    {
        title: "Multiple Upload Options",
        description:
            "Upload audio recordings, text files, or type your pitch directly. Our flexible system works with your preferred format.",
        icon: CheckCircle2,
    },
];

export const steps = [
    {
        title: "Upload Your Pitch",
        description:
            "Simply upload your pitch as audio, text file, or type it directly into our platform. We support multiple formats for your convenience.",
    },
    {
        title: "AI Analysis",
        description:
            "Our AI analyzes your pitch across key dimensions including problem-solution fit, business model, team capabilities, and presentation quality.",
    },
    {
        title: "Get Detailed Feedback",
        description:
            "Receive a comprehensive evaluation with specific scores, strengths, improvements, and actionable recommendations to enhance your pitch.",
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