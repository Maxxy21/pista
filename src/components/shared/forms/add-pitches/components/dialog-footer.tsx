"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter as ShadcnDialogFooter } from "@/components/ui/dialog";

interface DialogFooterProps {
  currentStep: "pitch" | "questions" | "review";
  currentQuestionIndex: number;
  questionsLength: number;
  questions: Array<{ text: string; answer: string }>;
  isProcessing: boolean;
  pending: boolean;
  isContinueDisabled: boolean;
  onBack: (step?: "pitch" | "questions" | "review", questionIndex?: number) => void;
  onContinue: () => void;
  onNextQuestion: () => void;
  onSubmit: () => void;
}

export function DialogFooter({
  currentStep,
  currentQuestionIndex,
  questionsLength,
  questions,
  isProcessing,
  pending,
  isContinueDisabled,
  onBack,
  onContinue,
  onNextQuestion,
  onSubmit,
}: DialogFooterProps) {
  const handleBack = () => {
    if (currentStep === "questions") {
      if (currentQuestionIndex > 0) {
        onBack(undefined, currentQuestionIndex - 1);
      } else {
        onBack("pitch");
      }
    } else if (currentStep === "review") {
      if (questionsLength > 0) {
        onBack("questions", questionsLength - 1);
      } else {
        onBack("pitch");
      }
    }
  };

  return (
    <ShadcnDialogFooter className="px-6 py-4 border-t">
      <div className="flex justify-between w-full">
        {currentStep !== "pitch" ? (
          <Button
            variant="outline"
            onClick={handleBack}
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
            onClick={onContinue}
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
            onClick={onNextQuestion}
            disabled={!questions[currentQuestionIndex]?.answer}
            className="gap-2"
          >
            {currentQuestionIndex === questionsLength - 1 ? "Review" : "Next Question"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {currentStep === "review" && (
          <Button
            onClick={onSubmit}
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
    </ShadcnDialogFooter>
  );
}