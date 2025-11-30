"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-medium">Theme</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your preferred theme for the application.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => setTheme("light")}
        >
          <Icons.sun className="mr-2 h-4 w-4" />
          Light
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => setTheme("dark")}
        >
          <Icons.moon className="mr-2 h-4 w-4" />
          Dark
        </Button>
        <Button
          variant={theme === "system" ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => setTheme("system")}
        >
          <Icons.settings className="mr-2 h-4 w-4" />
          System
        </Button>
      </div>
    </div>
  );
}
