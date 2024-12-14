import {useForm} from "react-hook-form";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useDropzone} from "react-dropzone";
import {toast} from "sonner";
import {z} from "zod";

import {Form, FormField, FormItem, FormControl, FormMessage} from "@/components/ui/form";
import {DialogClose, DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Dropzone} from "@/components/add-pitches/dropzone";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {FormSchema} from "@/components/add-pitches/form-schema";

import {api} from "@/convex/_generated/api";
import {AnimatePresence} from "framer-motion";
import {fileToText} from "@/utils";
import {Loader2} from "lucide-react";

interface UploadFormProps {
    orgId: string;
}


export const UploadForm = ({orgId}:UploadFormProps) => {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const {mutate, pending} = useApiMutation(api.pitches.create);
    const [isProcessing, setIsProcessing] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pitchTitle: "",
            contentType: "audio",
            content: "",
            file: null,
        }
    });

    const handleFileChange = (newFiles: File[]) => {
        setFiles(newFiles);
        form.setValue("file", newFiles);
    };

    const dropzoneProps = useDropzone({
        multiple: false,
        onDrop: handleFileChange,
        accept: form.watch("contentType") === "audio"
            ? {'audio/*': ['.mp3', '.wav', '.m4a']}
            : {'text/plain': ['.txt']},
        noClick: false,
    });




    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            setIsProcessing(true);
            const { pitchTitle, contentType, content } = data;
            let transcriptionText = "";

            // Process content based on type
            if (contentType === 'text') {
                transcriptionText = content || "";
            } else if (files.length > 0) {
                if (contentType === 'audio') {
                    const formData = new FormData();
                    formData.append('audio', files[0]);

                    try {
                        const transcriptionResponse = await fetch('/api/transcribe', {
                            method: 'POST',
                            body: formData,
                        });

                        if (!transcriptionResponse.ok) {
                            throw new Error('Transcription failed: ' + (await transcriptionResponse.text()));
                        }

                        const transcriptionData = await transcriptionResponse.json();
                        transcriptionText = transcriptionData.text;
                    } catch (error) {
                        console.error('Audio processing error:', error);
                        throw new Error('Failed to process audio file');
                    }
                } else if (contentType === 'textFile') {
                    transcriptionText = await fileToText(files[0]);
                }
            }

            if (!transcriptionText?.trim()) {
                throw new Error("No valid text content provided");
            }

            // Evaluate the pitch
            let evaluationResults;
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 240000);

                const evaluationResponse = await fetch('/api/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: transcriptionText }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!evaluationResponse.ok) {
                    throw new Error('Evaluation failed');
                }

                evaluationResults = await evaluationResponse.json();
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    throw new Error('Evaluation timed out');
                } else {
                    throw error;
                }
            }

            // Create the pitch with all required fields
            const id = await mutate({
                orgId,
                title: pitchTitle,
                text: transcriptionText,
                type: contentType,
                status: "evaluated",
                evaluation: evaluationResults,
            });

            toast.success("Pitch created successfully");
            router.push(`/pitch/${id}`);
            setFiles([]);
            form.reset();
        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error("Failed to create pitch");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                        <Dropzone
                            contentType={form.watch("contentType")}
                            files={files}
                            {...dropzoneProps}
                        />
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

                <DialogFooter>
                    <div className="flex w-full justify-between">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={pending || !form.formState.isValid || isProcessing}
                            className="bg-gradient-to-b from-blue-500 to-blue-600"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Analyzing...
                                </>
                            ) : pending ? (
                                "Adding..."
                            ) : (
                                "Add Pitch"
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </form>
        </Form>
    );
};