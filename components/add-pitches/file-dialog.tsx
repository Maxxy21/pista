"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/convex/_generated/api"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { motion, AnimatePresence } from "framer-motion"


// UI Components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Icons
import {
    ArrowLeft,
    ArrowRight,
    Loader2,
} from "lucide-react"

// Custom Components
import { InputStep } from "./steps/input-step"
import { ReviewStep } from "./steps/review-step"
import { ResultStep } from "./steps/result-step"

// Types
interface FileDialogProps {
    orgId: string
    children: React.ReactNode
    className?: string
}

type Step = "input" | "review" | "result"

export function FileDialog({ orgId, children, className }: FileDialogProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [currentStep, setCurrentStep] = useState<Step>("input")
    const [pitchData, setPitchData] = useState({
        title: "",
        type: "text",
        content: "",
    })
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [processedText, setProcessedText] = useState<string>("")
    const [result, setResult] = useState<any>(null)

    const { mutate: createPitch, pending } = useApiMutation(api.pitches.create)

    const resetForm = () => {
        setPitchData({
            title: "",
            type: "text",
            content: "",
        })
        setFiles([])
        setProcessedText("")
        setResult(null)
        setCurrentStep("input")
        setUploadProgress(0)
    }

    const handleClose = () => {
        setIsOpen(false)
        setTimeout(resetForm, 300) // Reset after dialog close animation
    }

    const processContent = async () => {
        try {
            setIsProcessing(true)
            const { type, content } = pitchData
            let text = ""

            if (type === 'text') {
                text = content || ""
            } else if (files.length > 0) {
                if (type === 'audio') {
                    // Simulate upload progress
                    const simulateProgress = () => {
                        let progress = 0
                        const interval = setInterval(() => {
                            progress += 5
                            setUploadProgress(Math.min(progress, 90))
                            if (progress >= 90) clearInterval(interval)
                        }, 200)
                        return interval
                    }

                    const progressInterval = simulateProgress()

                    try {
                        const formData = new FormData()
                        formData.append('audio', files[0])

                        const transcriptionResponse = await fetch('/api/transcribe', {
                            method: 'POST',
                            body: formData,
                        })

                        clearInterval(progressInterval)
                        setUploadProgress(100)

                        if (!transcriptionResponse.ok) {
                            throw new Error('Transcription failed')
                        }

                        const transcriptionData = await transcriptionResponse.json()
                        text = transcriptionData.text
                    } catch (error) {
                        throw error
                    }
                } else if (type === 'textFile') {
                    text = await files[0].text()
                }
            }

            setProcessedText(text)
            return text
        } catch (error) {
            console.error("Error processing content:", error)
            toast({
                title: "Error",
                description: "Failed to process your pitch",
                variant: "destructive",
            })
            throw error
        } finally {
            setIsProcessing(false)
            setUploadProgress(0)
        }
    }

    const handleNext = async () => {
        try {
            const text = await processContent()
            if (text) {
                setCurrentStep("review")
            }
        } catch (error) {
            // Error already handled in processContent
        }
    }

    const handleBack = () => {
        setCurrentStep("input")
    }

    const handleSubmit = async () => {
        try {
            // Evaluate the pitch
            const evaluationResponse = await fetch("/api/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: processedText,
                }),
            })

            if (!evaluationResponse.ok) throw new Error("Evaluation failed")
            const evaluationData = await evaluationResponse.json()

            // Create pitch in database
            const id = await createPitch({
                orgId,
                title: pitchData.title,
                text: processedText,
                type: pitchData.type,
                status: "evaluated",
                evaluation: evaluationData,
            })

            setResult({
                id,
                evaluation: evaluationData,
            })

            setCurrentStep("result")

            toast({
                title: "Success!",
                description: "Your pitch has been evaluated",
            })
        } catch (error) {
            console.error('Error:', error)
            toast({
                title: "Error",
                description: "Failed to evaluate your pitch",
                variant: "destructive",
            })
        }
    }

    const handleViewResults = () => {
        handleClose()
        router.push(`/pitch/${result.id}`)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className={className}>{children}</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {currentStep === "input" && "Create New Pitch"}
                        {currentStep === "review" && "Review Your Pitch"}
                        {currentStep === "result" && "Evaluation Complete"}
                    </DialogTitle>
                    <DialogDescription>
                        {currentStep === "input" && "Enter your pitch details or upload a file to get started."}
                        {currentStep === "review" && "Review your pitch before submitting for evaluation."}
                        {currentStep === "result" && "Your pitch has been evaluated successfully."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <AnimatePresence mode="wait">
                        {currentStep === "input" && (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <InputStep
                                    pitchData={pitchData}
                                    setPitchData={setPitchData}
                                    files={files}
                                    setFiles={setFiles}
                                    isProcessing={isProcessing}
                                />
                            </motion.div>
                        )}

                        {currentStep === "review" && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ReviewStep
                                    pitchData={pitchData}
                                    processedText={processedText}
                                />
                            </motion.div>
                        )}

                        {currentStep === "result" && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ResultStep
                                    result={result}
                                    onViewResults={handleViewResults}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter>
                    <div className="flex w-full justify-between">
                        <div>
                            {currentStep === "review" && (
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={pending || isProcessing}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                            )}
                        </div>
                        <div>
                            {currentStep === "input" && (
                                <Button
                                    onClick={handleNext}
                                    disabled={isProcessing}
                                    className="gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Next
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            )}

                            {currentStep === "review" && (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={pending || isProcessing}
                                    className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                >
                                    {pending || isProcessing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Evaluating...
                                        </>
                                    ) : (
                                        "Submit for Evaluation"
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogFooter>

                {/* Upload Progress Overlay */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="max-w-md w-full p-6 space-y-4">
                            <h3 className="font-semibold text-center">Processing Your Pitch</h3>
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-sm text-center text-muted-foreground">
                                {uploadProgress < 50
                                    ? "Uploading and processing audio..."
                                    : "Generating transcript..."}
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}