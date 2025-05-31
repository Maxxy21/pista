"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
    Loader2,
    Upload,
    ChevronRight,
    ChevronLeft,
    Mic,
    File,
    FileText,
    CheckCircle2,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface StepInfo {
    title: string;
    description: string;
    progress: number;
}

interface StepsConfig {
    pitch: StepInfo;
    questions: StepInfo;
    review: StepInfo;
}

type Step = keyof StepsConfig;

interface ModernEvaluationDialogProps {
    orgId: string;
    children?: React.ReactNode;
    className?: string;
}

const steps: StepsConfig = {
    pitch: {
        title: "Upload Your Pitch",
        description: "Share your pitch as text, audio, or upload a file",
        progress: 33,
    },
    questions: {
        title: "Answer Questions",
        description: "Respond to follow-up questions to improve your evaluation",
        progress: 66,
    },
    review: {
        title: "Review and Submit",
        description: "Review your pitch and responses before getting your evaluation",
        progress: 100,
    },
};

const initialPitchData = {
    title: "",
    type: "text",
    content: "",
};

export function FileDialog({
    orgId,
    children,
    className,
}: ModernEvaluationDialogProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>("pitch");
    const [pitchData, setPitchData] = useState(initialPitchData);
    const [questions, setQuestions] = useState<Array<{ text: string; answer: string }>>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [pitchText, setPitchText] = useState("");

    const { mutate: createPitch, pending } = useApiMutation(api.pitches.create);

    // Memoize dropzone config for performance and to avoid unnecessary re-renders
    const onDrop = useCallback(
        (acceptedFiles: File[]) => setFiles(acceptedFiles),
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept:
            pitchData.type === "audio"
                ? { "audio/*": [".mp3", ".wav", ".m4a"] }
                : { "text/plain": [".txt"] },
        onDrop,
        disabled: isProcessing,
    });

    const processContent = useCallback(async () => {
        const { type, content } = pitchData;
        let text = "";

        if (type === "text") {
            text = content || "";
        } else if (files.length > 0) {
            if (type === "audio") {
                const formData = new FormData();
                formData.append("audio", files[0]);

                // Simulate upload progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 5;
                    setUploadProgress((prev) => Math.min(progress, 90));
                    if (progress >= 90) clearInterval(interval);
                }, 200);

                try {
                    const transcriptionResponse = await fetch("/api/transcribe", {
                        method: "POST",
                        body: formData,
                    });

                    clearInterval(interval);
                    setUploadProgress(100);

                    if (!transcriptionResponse.ok) {
                        throw new Error("Transcription failed");
                    }

                    const transcriptionData = await transcriptionResponse.json();
                    text = transcriptionData.text;
                } catch (error) {
                    clearInterval(interval);
                    throw error;
                }
            } else if (type === "textFile") {
                text = await files[0].text();
            }
        }

        return text;
    }, [pitchData, files]);

    const generateQuestions = useCallback(async () => {
        setIsProcessing(true);
        try {
            const text = await processContent();
            setPitchText(text);

            const response = await fetch("/api/generate-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) throw new Error("Failed to generate questions");
            const data = await response.json();

            setQuestions(
                data.questions.map((q: string) => ({
                    text: q,
                    answer: "",
                }))
            );
            setCurrentStep("questions");
        } catch (error) {
            toast.error("Failed to process pitch");
        } finally {
            setIsProcessing(false);
            setUploadProgress(0);
        }
    }, [processContent]);

    const handleSubmit = useCallback(async () => {
        setIsProcessing(true);
        try {
            const evaluationResponse = await fetch("/api/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: pitchText,
                    questions,
                }),
            });

            if (!evaluationResponse.ok) throw new Error("Evaluation failed");
            const evaluationData = await evaluationResponse.json();

            // Create pitch in database
            const id = await createPitch({
                orgId,
                title: pitchData.title,
                text: pitchText,
                type: pitchData.type,
                status: "evaluated",
                evaluation: evaluationData,
                questions,
            });

            toast.success("Pitch created successfully");
            setIsOpen(false);
            router.push(`/pitch/${id}`);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to create pitch");
        } finally {
            setIsProcessing(false);
            setUploadProgress(0);
        }
    }, [pitchData, pitchText, questions, createPitch, orgId, router]);

    const resetForm = useCallback(() => {
        setPitchData(initialPitchData);
        setFiles([]);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setPitchText("");
        setCurrentStep("pitch");
    }, []);

    // Reset form after dialog closes with a delay to avoid visual jumping
    useEffect(() => {
        if (!isOpen) {
            const timeout = setTimeout(resetForm, 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen, resetForm]);

    // Helper for disabling continue button
    const isContinueDisabled =
        isProcessing ||
        !pitchData.title ||
        (pitchData.type === "text"
            ? !pitchData.content
            : files.length === 0);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button
                        className={cn(
                            "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 gap-2",
                            className
                        )}
                    >
                        <Upload className="h-4 w-4" />
                        New Pitch
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
                <div className="sticky top-0 z-10 bg-background border-b">
                    <DialogHeader className="px-6 pt-6 pb-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-md">
                                <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>{steps[currentStep].title}</DialogTitle>
                                <DialogDescription className="mt-1">
                                    {steps[currentStep].description}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Step Progress */}
                    <div className="px-6 pb-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                            <span>
                                Step{" "}
                                {currentStep === "pitch"
                                    ? 1
                                    : currentStep === "questions"
                                    ? 2
                                    : 3}{" "}
                                of 3
                            </span>
                            <span>{steps[currentStep].progress}% Complete</span>
                        </div>
                        <Progress value={steps[currentStep].progress} className="h-1" />
                    </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {currentStep === "pitch" && (
                            <motion.div
                                key="pitch-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Pitch Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="Enter a descriptive title for your pitch"
                                            value={pitchData.title}
                                            onChange={(e) =>
                                                setPitchData((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                            className="h-11"
                                            autoFocus
                                        />
                                    </div>

                                    <Tabs
                                        defaultValue="text"
                                        value={pitchData.type}
                                        onValueChange={(value) => {
                                            setPitchData((prev) => ({
                                                ...prev,
                                                type: value,
                                                content: "",
                                            }));
                                            setFiles([]);
                                        }}
                                    >
                                        <TabsList className="grid grid-cols-3 mb-4">
                                            <TabsTrigger value="text" className="gap-2">
                                                <FileText className="h-4 w-4" /> Text
                                            </TabsTrigger>
                                            <TabsTrigger value="audio" className="gap-2">
                                                <Mic className="h-4 w-4" /> Audio
                                            </TabsTrigger>
                                            <TabsTrigger value="textFile" className="gap-2">
                                                <File className="h-4 w-4" /> File
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="text" className="mt-0">
                                            <div className="space-y-2">
                                                <Label>Pitch Content</Label>
                                                <Textarea
                                                    placeholder="Enter your pitch text here..."
                                                    value={pitchData.content}
                                                    onChange={(e) =>
                                                        setPitchData((prev) => ({
                                                            ...prev,
                                                            content: e.target.value,
                                                        }))
                                                    }
                                                    className="min-h-[200px] resize-none"
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="audio" className="mt-0">
                                            <div
                                                {...getRootProps()}
                                                className={cn(
                                                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                                                    isDragActive &&
                                                        !isProcessing &&
                                                        "border-primary bg-primary/5",
                                                    isProcessing
                                                        ? "opacity-50 cursor-not-allowed bg-muted"
                                                        : "hover:border-primary hover:bg-primary/5"
                                                )}
                                            >
                                                <input {...getInputProps()} />
                                                {files.length > 0 ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <Mic className="h-8 w-8 text-primary" />
                                                        </div>
                                                        <p className="font-medium">{files[0].name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {(
                                                                files[0].size /
                                                                (1024 * 1024)
                                                            ).toFixed(2)}{" "}
                                                            MB
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <Upload className="h-8 w-8 text-primary" />
                                                        </div>
                                                        <p className="font-medium">
                                                            {isDragActive
                                                                ? "Drop the audio file here"
                                                                : "Drag & drop your audio file here"}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Supports MP3, WAV, M4A (max 50MB)
                                                        </p>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            type="button"
                                                        >
                                                            Browse files
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="textFile" className="mt-0">
                                            <div
                                                {...getRootProps()}
                                                className={cn(
                                                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                                                    isDragActive &&
                                                        !isProcessing &&
                                                        "border-primary bg-primary/5",
                                                    isProcessing
                                                        ? "opacity-50 cursor-not-allowed bg-muted"
                                                        : "hover:border-primary hover:bg-primary/5"
                                                )}
                                            >
                                                <input {...getInputProps()} />
                                                {files.length > 0 ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <FileText className="h-8 w-8 text-primary" />
                                                        </div>
                                                        <p className="font-medium">{files[0].name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {(
                                                                files[0].size /
                                                                (1024 * 1024)
                                                            ).toFixed(2)}{" "}
                                                            MB
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <Upload className="h-8 w-8 text-primary" />
                                                        </div>
                                                        <p className="font-medium">
                                                            {isDragActive
                                                                ? "Drop the text file here"
                                                                : "Drag & drop your text file here"}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Supports TXT files (max 5MB)
                                                        </p>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            type="button"
                                                        >
                                                            Browse files
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === "questions" && (
                            <motion.div
                                key="questions-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="space-y-1">
                                                <h3 className="font-medium">
                                                    Question {currentQuestionIndex + 1} of {questions.length}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    These questions help improve your evaluation accuracy
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                {questions.map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            i === currentQuestionIndex
                                                                ? "bg-primary"
                                                                : i < currentQuestionIndex
                                                                ? "bg-primary/40"
                                                                : "bg-muted"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentQuestionIndex}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-4"
                                            >
                                                <p className="text-base font-medium">
                                                    {questions[currentQuestionIndex].text}
                                                </p>
                                                <Textarea
                                                    placeholder="Type your answer here..."
                                                    value={questions[currentQuestionIndex].answer}
                                                    onChange={(e) => {
                                                        setQuestions((prev) => {
                                                            const updated = [...prev];
                                                            updated[currentQuestionIndex].answer = e.target.value;
                                                            return updated;
                                                        });
                                                    }}
                                                    className="min-h-[150px] resize-none"
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {currentStep === "review" && (
                            <motion.div
                                key="review-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <Card>
                                    <CardContent className="p-6 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Pitch Summary</h3>
                                            <div className="flex items-center gap-2 mb-4">
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                <span className="text-sm text-muted-foreground">
                                                    Your pitch is ready for evaluation
                                                </span>
                                            </div>

                                            <div className="rounded-lg bg-muted p-4">
                                                <p className="font-medium">{pitchData.title}</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {pitchData.type === "text"
                                                        ? `${pitchData.content.slice(0, 100)}${
                                                              pitchData.content.length > 100 ? "..." : ""
                                                          }`
                                                        : files[0]?.name}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">
                                                Follow-up Questions
                                            </h3>
                                            <div className="space-y-3">
                                                {questions.map((q, index) => (
                                                    <div key={index} className="space-y-1">
                                                        <p className="text-sm font-medium">
                                                            {index + 1}. {q.text}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground pl-5">
                                                            {q.answer}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter className="px-6 py-4 border-t">
                    <div className="flex justify-between w-full">
                        {currentStep !== "pitch" ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (currentStep === "questions") {
                                        if (currentQuestionIndex > 0) {
                                            setCurrentQuestionIndex((i) => i - 1);
                                        } else {
                                            setCurrentStep("pitch");
                                        }
                                    } else if (currentStep === "review") {
                                        setCurrentStep("questions");
                                        setCurrentQuestionIndex(questions.length - 1);
                                    }
                                }}
                                disabled={isProcessing}
                                className="gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back
                            </Button>
                        ) : (
                            <div />
                        )}

                        {currentStep === "pitch" && (
                            <Button
                                onClick={generateQuestions}
                                disabled={isContinueDisabled}
                                className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        )}

                        {currentStep === "questions" && (
                            <Button
                                onClick={() => {
                                    if (currentQuestionIndex < questions.length - 1) {
                                        setCurrentQuestionIndex((i) => i + 1);
                                    } else {
                                        setCurrentStep("review");
                                    }
                                }}
                                disabled={!questions[currentQuestionIndex].answer}
                                className="gap-2"
                            >
                                {currentQuestionIndex === questions.length - 1
                                    ? "Review"
                                    : "Next Question"}
                                <ChevronRight className="h-4 w-4" />
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
    );
}