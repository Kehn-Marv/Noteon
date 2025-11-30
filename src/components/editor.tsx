"use client";

import { cn } from "@/lib/utils";
import {
  MDXEditor,
  MDXEditorProps,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertCodeBlock,
  ListsToggle,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { FC } from "react";

interface EditorProps extends MDXEditorProps {
  onValueChange: (value: string) => void;
  className?: string;
  contentEditableClassName?: string;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = ({
  onValueChange,
  className,
  contentEditableClassName,
  ...props
}: EditorProps) => {
  return (
    <MDXEditor
      onChange={onValueChange}
      className={className}
      contentEditableClassName={cn(
        "prose prose-stone dark:prose-invert !p-0",
        contentEditableClassName,
      )}
      {...props}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <ListsToggle />
              <InsertTable />
              <InsertCodeBlock />
            </>
          ),
        }),
        headingsPlugin({}),
        listsPlugin(),
        tablePlugin(),
        codeBlockPlugin({
          defaultCodeBlockLanguage: "js",
        }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: "JavaScript",
            css: "CSS",
            ts: "TypeScript",
            html: "HTML",
            python: "Python",
            bash: "Bash",
            json: "JSON",
            yaml: "YAML",
            markdown: "Markdown",
            sql: "SQL",
            xml: "XML",
          },
        }),
        markdownShortcutPlugin(),
      ]}
    />
  );
};

export default Editor;
