"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AICommand } from "@/lib/ai/commands";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface AICommandsMenuProps {
  onCommandSelect: (command: AICommand) => void;
  disabled?: boolean;
}

export function AICommandsMenu({
  onCommandSelect,
  disabled,
}: AICommandsMenuProps) {
  const [hasSelection, setHasSelection] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Check for selection when menu opens
      const selection = window.getSelection();
      setHasSelection(!!selection?.toString().trim());
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-1.5 sm:gap-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 hover:border-primary/30 transition-all duration-200 shadow-sm"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium hidden sm:inline">AI Commands</span>
          <span className="font-medium sm:hidden">AI</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={16} alignOffset={-80} className="w-[calc(100vw-2rem)] max-w-64 p-3">
        <DropdownMenuLabel className="text-base font-semibold px-2 py-2 text-gray-900 dark:text-white">
          Transform Your Notes
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          onClick={() => onCommandSelect("clarify")}
          disabled={!hasSelection}
          className="rounded-lg px-3 py-3 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
        >
          <div className="flex flex-col gap-1 w-full">
            <span className="font-semibold text-base text-gray-900 dark:text-white">Clarify</span>
            <span className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">
              {hasSelection
                ? "Rewrite selected text clearly"
                : "Select text first"}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onCommandSelect("quiz")}
          className="rounded-lg px-3 py-3 cursor-pointer transition-colors"
        >
          <div className="flex flex-col gap-1 w-full">
            <span className="font-semibold text-base text-gray-900 dark:text-white">Generate Quiz</span>
            <span className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">
              Create practice questions
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onCommandSelect("gaps")}
          className="rounded-lg px-3 py-3 cursor-pointer transition-colors"
        >
          <div className="flex flex-col gap-1 w-full">
            <span className="font-semibold text-base text-gray-900 dark:text-white">Find Gaps</span>
            <span className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">
              Identify missing information
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onCommandSelect("exam-ready")}
          className="rounded-lg px-3 py-3 cursor-pointer transition-colors"
        >
          <div className="flex flex-col gap-1 w-full">
            <span className="font-semibold text-base text-gray-900 dark:text-white">Exam-Ready</span>
            <span className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">
              Condense to key points
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
