"use client";

import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { z } from "zod";

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dropzone } from "@/components/add-pitches/dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { FormSchema } from "@/components/add-pitches/form-schema";
import { api } from "@/convex/_generated/api";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AudioPreview } from "./audio-preview";
import {ScrollArea} from "@/components/ui/scroll-area";

type Step = "upload" | "questions" | "review";

interface UploadFormProps {
    orgId: string;
    onStepChange: (step: "upload" | "questions" | "review") => void;
}

interface EvaluationResponse {
    evaluations: Array<{
        criteria: string;
        comment: string;
        score: number;
        strengths: string[];
        improvements: string[];
        aspects: string[];
    }>;
    overallScore: number;
    overallFeedback: string;
}

export const UploadForm = ({ orgId,onStepChange }: UploadFormProps) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>("upload");
    const [files, setFiles] = useState<File[]>([]);
    const [questions, setQuestions] = useState<Array<{ text: string; answer: string }>>([]);
    const [pitchText, setPitchText] = useState<string>("");
    const { mutate, pending } = useApiMutation(api.pitches.create);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pitchTitle: "",
            contentType: "audio",
            content: "",
            file: null,
        }
    });

    const setStep = (newStep: "upload" | "questions" | "review") => {
        setCurrentStep(newStep);
        onStepChange(newStep);
    };

    const handleFileChange = (newFiles: File[]) => {
        setFiles(newFiles);
        form.setValue("file", newFiles);
    };

    const dropzoneProps = useDropzone({
        multiple: false,
        onDrop: handleFileChange,
        accept: form.watch("contentType") === "audio"
            ? { 'audio/*': ['.mp3', '.wav', '.m4a'] }
            : { 'text/plain': ['.txt'] },
        noClick: false,
    });

    const processContent = async () => {
        const { contentType, content } = form.getValues();
        let text = "";

        if (contentType === 'text') {
            text = content || "";
        } else if (files.length > 0) {
            if (contentType === 'audio') {
                const formData = new FormData();
                formData.append('audio', files[0]);

                const transcriptionResponse = await fetch('/api/transcribe', {
                    method: 'POST',
                    body: formData,
                });

                if (!transcriptionResponse.ok) {
                    throw new Error('Transcription failed');
                }

                const transcriptionData = await transcriptionResponse.json();
                text = transcriptionData.text;
            } else if (contentType === 'textFile') {
                text = await files[0].text();
            }
        }

        return text;
    };

    const generateQuestions = async () => {
        try {
            setIsProcessing(true);
            const text = await processContent();
            setPitchText(text);

            const response = await fetch("/api/generate-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) throw new Error("Failed to generate questions");
            const data = await response.json();

            setQuestions(data.questions.map((q: string) => ({
                text: q,
                answer: ""
            })));

            setStep("questions");
        } catch (error) {
            toast.error("Failed to process pitch");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsProcessing(true);

            const evaluationResponse = await fetch("/api/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: pitchText,
                    questions
                }),
            });

            if (!evaluationResponse.ok) throw new Error("Evaluation failed");
            const evaluationData = await evaluationResponse.json();

            // Remove the questions field and only send the fields that match the validator
            const id = await mutate({
                orgId,
                title: form.getValues("pitchTitle"),
                text: pitchText,
                type: form.getValues("contentType"),
                status: "evaluated",
                evaluation: evaluationData
            });

            toast.success("Pitch created successfully");
            router.push(`/pitch/${id}`);
            form.reset();
            setFiles([]);
            setQuestions([]);
            setPitchText("");
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to create pitch");
        } finally {
            setIsProcessing(false);
            setUploadProgress(0);
        }
    };

    const steps = {
        upload: {
            title: "Upload Content",
            progress: 0
        },
        questions: {
            title: "Answer Questions",
            progress: 66
        },
        review: {
            title: "Review",
            progress: 100
        }
    };

    return (
        <Form {...form}>
            <div className="space-y-6">
                <Progress value={steps[currentStep].progress} />

                <AnimatePresence mode="wait">
                    {currentStep === "upload" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="pitchTitle"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="title">Title</Label>
                                                <Input
                                                    placeholder="Title of your pitch"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contentType"
                                render={({field}) => (
                                    <FormItem>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="contentType">Content Type</Label>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    setFiles([]);
                                                }}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select upload type"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="audio">Audio</SelectItem>
                                                    <SelectItem value="textFile">Text File</SelectItem>
                                                    <SelectItem value="text">Text</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <AnimatePresence mode="wait">
                                {form.watch("contentType") !== "text" ? (
                                    <div className="space-y-4">
                                        <Dropzone
                                            contentType={form.watch("contentType")}
                                            files={files}
                                            {...dropzoneProps}
                                        />
                                        {files[0] && files[0].type.includes('audio') && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <AudioPreview
                                                    file={files[0]}
                                                    onRemove={() => {
                                                        setFiles([]);
                                                        form.setValue("file", null);
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        className="min-h-[200px] resize-none"
                                                        placeholder="Enter your pitch text here..."
                                                        {...field}
                                                        required={form.watch("contentType") === "text"}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </AnimatePresence>

                            <Button
                                onClick={generateQuestions}
                                disabled={!form.formState.isValid || isProcessing}
                                className="w-full"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ChevronRight className="ml-2 h-4 w-4"/>
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {currentStep === "questions" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <Label className="text-sm text-muted-foreground">
                                                Question {currentQuestionIndex + 1} of {questions.length}
                                            </Label>
                                            <Progress
                                                value={((currentQuestionIndex + 1) / questions.length) * 100}
                                                className="w-1/3"
                                            />
                                        </div>

                                        <motion.div
                                            key={currentQuestionIndex}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <p className="text-sm font-medium mb-4">
                                                {questions[currentQuestionIndex].text}
                                            </p>
                                            <Textarea
                                                placeholder="Enter your answer"
                                                value={questions[currentQuestionIndex].answer}
                                                onChange={(e) => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[currentQuestionIndex].answer = e.target.value;
                                                    setQuestions(newQuestions);
                                                }}
                                                className="min-h-[100px] text-sm"
                                            />
                                        </motion.div>
                                    </CardContent>
                                </Card>

                                <div className="flex justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            if (currentQuestionIndex > 0) {
                                                setCurrentQuestionIndex(i => i - 1);
                                            } else {
                                                setStep("upload");
                                                setCurrentQuestionIndex(0);
                                            }
                                        }}
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4"/>
                                        {currentQuestionIndex === 0 ? 'Back to Upload' : 'Previous Question'}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (currentQuestionIndex < questions.length - 1) {
                                                setCurrentQuestionIndex(i => i + 1);
                                            } else {
                                                setStep("review");
                                                setCurrentQuestionIndex(0);
                                            }
                                        }}
                                        disabled={!questions[currentQuestionIndex].answer}
                                    >
                                        {currentQuestionIndex === questions.length - 1 ? 'Review' : 'Next Question'}
                                        <ChevronRight className="ml-2 h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === "review" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <Card>
                                <CardContent className="pt-6">
                                    <ScrollArea className="h-[400px] pr-4"> {/* Set fixed height and add padding for scrollbar */}
                                        <div className="space-y-6"> {/* Add container with spacing */}
                                            <div>
                                                <h3 className="text-sm font-semibold mb-2">Pitch</h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {form.watch("contentType") === "text"
                                                        ? form.watch("content")
                                                        : files[0]?.name
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold mb-2">Q&A</h3>
                                                {questions.map((q, index) => (
                                                    <div key={index} className="mb-4">
                                                        <p className="text-sm font-medium">Q: {q.text}</p>
                                                        <p className="text-sm text-muted-foreground">A: {q.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            <DialogFooter>
                                <div className="flex w-full justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep("questions")}
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4"/>
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={pending || isProcessing}
                                        className="bg-gradient-to-b from-blue-500 to-blue-600"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                Processing...
                                            </>
                                        ) : (
                                            "Submit"
                                        )}
                                    </Button>
                                </div>
                            </DialogFooter>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Form>
    );
};