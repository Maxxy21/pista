"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { FileText, Mic, File } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioDropzone } from "../components/audio-dropzone";
import { TextFileDropzone } from "../components/text-file-dropzone";

interface PitchData {
  title: string;
  type: "text" | "audio" | "textFile";
  content: string;
}

interface PitchInputStepProps {
  pitchData: PitchData;
  setPitchData: (data: PitchData | ((prev: PitchData) => PitchData)) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  isProcessing: boolean;
}

export function PitchInputStep({
  pitchData,
  setPitchData,
  files,
  setFiles,
  isProcessing,
}: PitchInputStepProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => setFiles(acceptedFiles), [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept:
      pitchData.type === "audio"
        ? { "audio/*": [".mp3", ".wav", ".m4a"] }
        : { "text/plain": [".txt"] },
    onDrop,
    disabled: isProcessing,
  });

  const handleTabChange = (value: string) => {
    setPitchData((prev) => ({
      ...prev,
      type: value as "text" | "audio" | "textFile",
      content: "",
    }));
    setFiles([]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Pitch Title</Label>
          <Input
            id="title"
            placeholder="Enter a descriptive title for your pitch"
            value={pitchData.title}
            onChange={(e) =>
              setPitchData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="h-11"
            autoFocus
          />
        </div>

        <Tabs value={pitchData.type} onValueChange={handleTabChange}>
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
                  setPitchData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="min-h-[200px] resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-0">
            <AudioDropzone
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              isProcessing={isProcessing}
              files={files}
            />
          </TabsContent>

          <TabsContent value="textFile" className="mt-0">
            <TextFileDropzone
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              isProcessing={isProcessing}
              files={files}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}