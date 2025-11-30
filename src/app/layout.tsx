import "@/app/globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { ChatStoreProvider } from "@/contexts/chat-store";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { CookiesProvider } from "next-client-cookies/server";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "Kehn Marv", url: "https://github.com/Kehn-Marv" }],
  creator: "Kehn Marv",
  metadataBase: new URL(siteConfig.domain),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.domain,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/screenshot.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/screenshot.png"],
    creator: "@KehnMarv",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CookiesProvider>
            <ChatStoreProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 items-center border-b px-2">
                    <SidebarTrigger />
                  </header>
                  <main>{children}</main>
                </SidebarInset>
              </SidebarProvider>
              {modal}
              <Toaster richColors />
            </ChatStoreProvider>
          </CookiesProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
