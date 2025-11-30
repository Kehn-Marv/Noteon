"use client";

import { Icons } from "@/components/icons";
import { Logo } from "@/components/logo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/contexts/chat-store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { chats, isLoading, deleteChat } = useChatStore();
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  const handleDeleteClick = (chatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingChatId(chatId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingChatId) return;
    
    try {
      await deleteChat(deletingChatId);
      setDeletingChatId(null);
      if (pathname === `/chat/${deletingChatId}`) {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarMenu className="mb-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link href="/">
                  <Icons.notebookPen />
                  <span>Journal</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/notes"}>
                <Link href="/notes">
                  <Icons.bookOpenText />
                  <span>Notes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>AI</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible className="group/collapsible" defaultOpen={false}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/chat"}
                  className="group/chat flex"
                >
                  <div className="flex h-4 w-4 items-center justify-center">
                    <Icons.botMessageSquare className="block transition-opacity duration-200 group-hover/chat:hidden" />
                    <CollapsibleTrigger asChild>
                      <Icons.chevronRight className="-ml-1 hidden h-5 w-5 rounded transition-transform duration-200 hover:bg-sidebar-accent group-hover/chat:block group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </div>
                  <Link
                    href="/chat"
                    className="flex flex-1 items-center justify-between"
                    title="New chat"
                  >
                    Chat
                    <Icons.circlePlus className="hidden h-4 w-4 group-hover/chat:block" />
                  </Link>
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {isLoading ? (
                      <SidebarMenuSubItem>
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          Loading chats...
                        </div>
                      </SidebarMenuSubItem>
                    ) : chats.length === 0 ? (
                      <SidebarMenuSubItem>
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          No chats yet
                        </div>
                      </SidebarMenuSubItem>
                    ) : (
                      chats.map((chat) => (
                        <SidebarMenuSubItem key={chat.id}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === `/chat/${chat.id}`}
                            className="group/item"
                          >
                            <div className="flex w-full items-center">
                              <Link href={`/chat/${chat.id}`} className="flex-1 truncate">
                                {chat.title}
                              </Link>
                              <button
                                className="hidden h-4 w-4 items-center justify-center rounded hover:bg-sidebar-accent group-hover/item:flex"
                                onClick={(e) => handleDeleteClick(chat.id, e)}
                                title="Delete chat"
                              >
                                <Icons.trash className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                              </button>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                <Link href="/settings" scroll={false}>
                  <Icons.settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <AlertDialog open={!!deletingChatId} onOpenChange={(open) => !open && setDeletingChatId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this chat and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <SidebarFooter>
        <div className="flex items-center gap-2 p-2">
          <Link
            href="https://github.com/Kehn-Marv/Noteon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-foreground transition-colors hover:text-sidebar-accent-foreground"
            title="GitHub"
          >
            <Icons.github className="h-5 w-5" />
          </Link>
          <Link
            href="https://linkedin.com/in/kehn-marv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-foreground transition-colors hover:text-sidebar-accent-foreground"
            title="LinkedIn"
          >
            <Icons.linkedin className="h-5 w-5" />
          </Link>
          <Link
            href="https://x.com/KehnMarv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-foreground transition-colors hover:text-sidebar-accent-foreground"
            title="X (Twitter)"
          >
            <Icons.twitter className="h-5 w-5" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
