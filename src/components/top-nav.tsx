"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, GitCompare, BarChart3, Home } from "lucide-react";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/articles", label: "Articles", icon: FileText },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/stats", label: "Stats", icon: BarChart3 },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/articles" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg">WikiWarfare</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "?");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                  isActive ? "text-foreground" : "text-foreground/60"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
