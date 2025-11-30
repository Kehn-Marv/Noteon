/** Originally from `vercel/ai-chatbot`
 * @link https://github.com/vercel/ai-chatbot/blob/main/components/message.tsx
 */

"use client";

import { Markdown } from "@/components/chat/markdown";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Message } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

export function PurePreviewMessage({ message }: { message: Message }) {
  return (
    <AnimatePresence>
      <motion.div
        className="group/message mx-auto w-full max-w-3xl px-4"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div className="flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:pr-2">
          {message.role === "assistant" && (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20 shadow-sm">
              <div className="translate-y-px">
                <Icons.sparkles size={14} className="text-primary" />
              </div>
            </div>
          )}
          <div
            className={cn("flex flex-col gap-4", {
              "rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground shadow-sm":
                message.role === "user",
            })}
          >
            {message.content.length > 0 ? (
              <Markdown>{message.content as string}</Markdown>
            ) : (
              <span className="font-light italic text-muted-foreground">
                Thinking...
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.message.content !== nextProps.message.content) return false;
    return true;
  },
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      className="group/message mx-auto w-full max-w-3xl px-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2",
          {
            "group-data-[role=user]/message:bg-muted": true,
          },
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20 shadow-sm">
          <Icons.sparkles size={14} className="text-primary animate-pulse" />
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-4 text-muted-foreground font-medium">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
