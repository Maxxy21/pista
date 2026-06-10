import { toast } from "sonner"

export { getScoreColor } from "@/lib/utils/evaluation-colors";

export const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    } catch (err) {
        toast.error("Failed to copy text")
    }
} 