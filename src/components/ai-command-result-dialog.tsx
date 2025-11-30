"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AICommand } from "@/lib/ai/commands";
import { Copy, Replace } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

interface AICommandResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  command: AICommand | null;
  result: string;
  onReplace?: () => void;
  canReplace?: boolean;
}

const COMMAND_TITLES: Record<AICommand, string> = {
  clarify: "Clarified Notes",
  quiz: "Generated Quiz",
  gaps: "Learning Gaps",
  "exam-ready": "Exam-Ready Summary",
};

export function AICommandResultDialog({
  open,
  onOpenChange,
  command,
  result,
  onReplace,
  canReplace,
}: AICommandResultDialogProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard");
  };

  const handleReplace = () => {
    if (onReplace) {
      onReplace();
      toast.success("Text replaced");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">
            {command ? COMMAND_TITLES[command] : "AI Result"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {command === "clarify" &&
              "Here's a clearer version of your notes"}
            {command === "quiz" && "Practice questions based on your notes"}
            {command === "gaps" &&
              "Areas that need more detail or clarification"}
            {command === "exam-ready" && "Key points for exam preparation"}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-border/50 bg-muted/30 p-5 shadow-sm">
          <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
            >
              {result}
            </ReactMarkdown>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={handleCopy} 
            className="gap-2 font-medium transition-all duration-200 hover:bg-accent"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          {canReplace && onReplace && (
            <Button 
              onClick={handleReplace} 
              className="gap-2 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Replace className="h-4 w-4" />
              Replace Selected Text
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
