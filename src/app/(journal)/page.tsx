"use client";

import { useJournalUpdates } from "@/app/(journal)/use-journal-updates";
import { useJournals } from "@/app/(journal)/use-journals";
import Editor from "@/components/editor";
import { Icons } from "@/components/icons";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex justify-center py-6 text-secondary-foreground">
      <Icons.loader className={`h-7 w-7 animate-spin ${className ?? ""}`} />
    </div>
  );
}

export default function Page() {
  const {
    journals,
    totalCount,
    isLoading,
    error,
    loadInitialData,
    loadMoreJournals,
  } = useJournals();
  const { handleContentChange } = useJournalUpdates();
  const { ref, inView } = useInView();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (inView) {
      loadMoreJournals();
    }
  }, [inView, loadMoreJournals]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading.initial) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {journals.map((journal, index) => (
        <div
          key={journal.id}
          className={`flex flex-col px-3 sm:px-4 pb-4 sm:pb-6 transition-colors hover:bg-accent/5 ${
            index === 0 ? "min-h-[calc(100vh-128px)]" : "min-h-72"
          }`}
        >
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">{journal.title}</h2>
          </div>
          <Editor
            markdown={journal.content ?? ""}
            placeholder="Start typing..."
            onValueChange={(value) => handleContentChange(journal.id, value)}
            contentEditableClassName={
              index === 0 ? "min-h-[calc(100vh-208px)]" : "min-h-56"
            }
          />
        </div>
      ))}

      <div ref={ref} className="h-10 w-full">
        {isLoading.more && <LoadingSpinner />}
        {journals.length >= totalCount && journals.length > 0 && (
          <div className="flex justify-center py-6 text-sm sm:text-base text-secondary-foreground">
            No more journals.
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
        >
          <Icons.arrowUp size={20} />
        </button>
      )}
    </div>
  );
}
