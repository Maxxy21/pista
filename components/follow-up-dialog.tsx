"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Loader2, Upload, ChevronRight, ChevronLeft } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

interface StepInfo {
    title: string;
    progress: number;
}

interface StepsConfig {
    pitch: StepInfo;
    questions: StepInfo;
    review: StepInfo;
}

type Step = keyof StepsConfig;

// Then update your steps object to use these types:

interface FollowUpDialogProps {
    orgId: string;
}

export function FollowUpDialog({ orgId }: FollowUpDialogProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<Step>("pitch");
    const [pitchData, setPitchData] = useState({
        title: "",
        type: "text",
        content: "",
    });
    const [questions, setQuestions] = useState<Array<{ text: string; answer: string }>>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: pitchData.type === "audio"
            ? { 'audio/*': ['.mp3', '.wav', '.m4a'] }
            : { 'text/plain': ['.txt'] },
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles);
        },
    });

    const { mutate: createPitch } = useApiMutation(api.pitches.create);

    // Initialize dialog state after mount
    useEffect(() => {
        setIsOpen(false);
    }, []);

    const generateQuestions = async () => {
        try {
            setIsProcessing(true);
            // Get pitch text either directly or from file
            let pitchText = pitchData.content;
            if (files[0]) {
                if (pitchData.type === "audio") {
                    const formData = new FormData();
                    formData.append("audio", files[0]);
                    const response = await fetch("/api/transcribe", {
                        method: "POST",
                        body: formData,
                    });
                    if (!response.ok) throw new Error("Transcription failed");
                    const data = await response.json();
                    pitchText = data.text;
                } else {
                    // Read text file
                    pitchText = await files[0].text();
                }
            }

            // Generate questions based on pitch content
            const response = await fetch("/api/generate-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: pitchText }),
            });

            if (!response.ok) throw new Error("Failed to generate questions");
            const data = await response.json();

            setQuestions(data.questions.map((q: string) => ({
                text: q,
                answer: ""
            })));

            setCurrentStep("questions");
        } catch (error) {
            toast.error("Failed to process pitch");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsProcessing(true);

            // Get pitch text either directly or from file
            let pitchText = pitchData.content;
            if (files[0]) {
                if (pitchData.type === "audio") {
                    const formData = new FormData();
                    formData.append("audio", files[0]);
                    const response = await fetch("/api/transcribe", {
                        method: "POST",
                        body: formData,
                    });
                    if (!response.ok) throw new Error("Transcription failed");
                    const data = await response.json();
                    pitchText = data.text;
                } else {
                    // Read text file
                    pitchText = await files[0].text();
                }
            }

            // Evaluate pitch with Q&A
            const evaluationResponse = await fetch("/api/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: pitchText,
                    questions: questions
                }),
            });

            if (!evaluationResponse.ok) throw new Error("Evaluation failed");
            const evaluationData = await evaluationResponse.json();
      
            // Create pitch in database
            await createPitch({
                orgId,
                title: pitchData.title,
                text: pitchText,
                type: pitchData.type,
                status: "evaluated",
                evaluation: evaluationData,
                questions: questions,
            });

            toast.success("Pitch created successfully");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to create pitch");
        } finally {
            setIsProcessing(false);
        }
    };

    const steps: StepsConfig = {
        pitch: {
            title: "Add Your Pitch",
            progress: 33,
        },
        questions: {
            title: "Follow-up Questions",
            progress: 66,
        },
        review: {
            title: "Review",
            progress: 100,
        },
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Add Pitch
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{steps[currentStep].title}</DialogTitle>
                </DialogHeader>

                <Progress value={steps[currentStep].progress} className="mb-4" />

                <div className="space-y-4">
                    {currentStep === "pitch" && (
                        <>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter pitch title"
                                        value={pitchData.title}
                                        onChange={(e) => setPitchData(prev => ({
                                            ...prev,
                                            title: e.target.value
                                        }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Content Type</Label>
                                    <Select
                                        value={pitchData.type}
                                        onValueChange={(value) => {
                                            setPitchData(prev => ({
                                                ...prev,
                                                type: value,
                                                content: ""
                                            }));
                                            setFiles([]);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select content type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="audio">Audio</SelectItem>
                                            <SelectItem value="textFile">Text File</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {pitchData.type === "text" ? (
                                    <div className="space-y-2">
                                        <Label>Pitch Content</Label>
                                        <Textarea
                                            placeholder="Enter your pitch"
                                            value={pitchData.content}
                                            onChange={(e) => setPitchData(prev => ({
                                                ...prev,
                                                content: e.target.value
                                            }))}
                                            className="min-h-[200px]"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        {...getRootProps()}
                                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                    >
                                        <input {...getInputProps()} />
                                        {files.length > 0 ? (
                                            <p>{files[0].name}</p>
                                        ) : (
                                            <p className="text-muted-foreground">
                                                {isDragActive
                                                    ? "Drop the file here"
                                                    : `Drag & drop or click to select ${
                                                        pitchData.type === "audio" ? "audio" : "text"
                                                    } file`
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Button
                                className="w-full"
                                onClick={generateQuestions}
                                disabled={
                                    isProcessing ||
                                    !pitchData.title ||
                                    (pitchData.type === "text" ? !pitchData.content : files.length === 0)
                                }
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </>
                    )}

                    {currentStep === "questions" && (
                        <>
                            <div className="space-y-4">
                                {questions.map((q, index) => (
                                    <Card key={index}>
                                        <CardContent className="pt-6 space-y-2">
                                            <Label>Question {index + 1}</Label>
                                            <p className="text-muted-foreground mb-4">{q.text}</p>
                                            <Textarea
                                                placeholder="Enter your answer"
                                                value={q.answer}
                                                onChange={(e) => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[index].answer = e.target.value;
                                                    setQuestions(newQuestions);
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep("pitch")}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                                <Button
                                    onClick={() => setCurrentStep("review")}
                                    disabled={questions.some(q => !q.answer)}
                                >
                                    Continue
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}

                    {currentStep === "review" && (
                        <>
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-2">Pitch</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {pitchData.type === "text"
                                            ? pitchData.content
                                            : files[0]?.name
                                        }
                                    </p>

                                    <h3 className="font-semibold mb-2">Q&A</h3>
                                    {questions.map((q, index) => (
                                        <div key={index} className="mb-4">
                                            <p className="font-medium">Q: {q.text}</p>
                                            <p className="text-muted-foreground">A: {q.answer}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep("questions")}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}