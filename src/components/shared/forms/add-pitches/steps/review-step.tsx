"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";

interface ReviewStepProps {
  pitchData: { title: string; type: string; content: string };
  files: File[];
  questions: Array<{ text: string; answer: string }>;
}

export function ReviewStep({ pitchData, files, questions }: ReviewStepProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Pitch Summary</h3>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm text-muted-foreground">Your pitch is ready for evaluation</span>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium">{pitchData.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {pitchData.type === "text"
                ? `${pitchData.content.slice(0, 100)}${pitchData.content.length > 100 ? "..." : ""}`
                : files[0]?.name}
            </p>
          </div>
        </div>
        {questions.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Follow-up Questions</h3>
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-sm font-medium">{index + 1}. {q.text}</p>
                    <p className="text-sm text-muted-foreground pl-5">{q.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

