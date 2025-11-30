import { FormButton } from "@/components/form-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Note, NoteType } from "@/lib/db";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.nativeEnum(NoteType),
  subject: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface NotesDialogProps {
  onSubmit: (
    data: Omit<Note, "id" | "createdAt" | "updatedAt" | "embeddingUpdatedAt" | "content">,
  ) => Promise<number>;
  trigger?: React.ReactNode;
  className?: string;
}

export function NotesDialog({
  onSubmit,
  trigger,
  className,
}: NotesDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: NoteType.Notes,
      subject: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    await onSubmit(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className={cn(
              "gap-2 px-4 py-2 text-sm font-semibold transition-all duration-200 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 hover:border-primary/30 shadow-sm",
              className,
            )}
          >
            <Plus className="h-4 w-4 text-primary" />
            <span>New Entry</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl gap-4 p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold">
            New Note Entry
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a new note entry. You can add content after creation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a descriptive title..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Math, History, Biology..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormButton type="submit" className="w-full">
              Create Entry
            </FormButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
