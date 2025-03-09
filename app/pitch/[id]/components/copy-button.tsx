import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { copyToClipboard } from './utils'

interface CopyButtonProps {
    text: string
    className?: string
}

export const CopyButton = ({ text, className }: CopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = async () => {
        await copyToClipboard(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={`h-8 w-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-black/70 ${className}`}
        >
            {isCopied ? (
                <Check className="h-4 w-4" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </Button>
    )
} 