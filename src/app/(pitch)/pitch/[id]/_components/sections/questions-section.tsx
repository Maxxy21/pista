import { useState, Fragment } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { Doc } from "@/convex/_generated/dataModel";
import { normalizeTranscriptText, splitParagraphs } from "@/lib/utils/text";

interface QuestionsSectionProps {
  data: Doc<"pitches">;
}

export const QuestionsSection = ({ data }: QuestionsSectionProps) => {
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);

  const questions = data.questions ?? [];
  if (questions.length === 0) return null;

  return (
    <Collapsible open={isQuestionsOpen} onOpenChange={setIsQuestionsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="mb-4 gap-2" aria-expanded={isQuestionsOpen}>
          {isQuestionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {isQuestionsOpen ? "Hide" : "Show"} Q&A
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AnimatePresence initial={false}>
          {isQuestionsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <CardContent className="pt-6 space-y-6">
                  {questions.map((qa, index) => (
                    <Fragment key={index}>
                      <div className="space-y-2">
                        <div className="font-medium text-primary" style={{ textAlign: 'justify' }}>
                          Q: {normalizeTranscriptText(qa.text)}
                        </div>
                        <div className="pl-4 border-l-2 border-muted-foreground/20">
                          <div className="text-muted-foreground" style={{ textAlign: 'justify' }}>
                            {splitParagraphs(normalizeTranscriptText(qa.answer)).map((p, i) => (
                              <p key={i} className="mb-2">A: {p}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};
