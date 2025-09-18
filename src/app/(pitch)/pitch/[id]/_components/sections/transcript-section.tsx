import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { motion } from "framer-motion"
import { CopyButton } from '../export/copy-button'
import { normalizeTranscriptText, splitParagraphs } from '@/lib/utils/text'

interface TranscriptSectionProps {
    data: {
        text: string
    }
}

export const TranscriptSection = ({ data }: TranscriptSectionProps) => {
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)

    const normalized = normalizeTranscriptText(data.text)
    const paragraphs = splitParagraphs(normalized)

    return (
        <Collapsible open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
            <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="mb-4 gap-2">
                    {isTranscriptOpen ? (
                        <ChevronUp className="h-4 w-4"/>
                    ) : (
                        <ChevronDown className="h-4 w-4"/>
                    )}
                    {isTranscriptOpen ? "Hide" : "Show"} Transcript
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="mb-6 relative">
                        <CardContent className="pt-6">
                            <div className="text-muted-foreground leading-relaxed" style={{ textAlign: 'justify' }}>
                                {paragraphs.map((p, i) => (
                                    <p key={i} className="mb-3">
                                        {p}
                                    </p>
                                ))}
                            </div>
                            {/*<div className="absolute top-3 right-3">*/}
                            {/*    <CopyButton text={data.text} />*/}
                            {/*</div>*/}
                        </CardContent>
                    </Card>
                </motion.div>
            </CollapsibleContent>
        </Collapsible>
    )
} 
