import { toast } from "sonner"

export const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (score >= 6) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (score >= 4) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
};

export const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    } catch (err) {
        toast.error("Failed to copy text")
    }
} 