"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ticket,
  WalletCards,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { logout } from "@/app/actions/logout";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Tickets",
    href: "/tickets",
    icon: Ticket,
  },
  {
    label: "Balance",
    href: "/balance",
    icon: WalletCards,
  },
];

export function AppNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <aside
        className={cn(
          "hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:flex-col border-r bg-background",
          "transition-[width] duration-200 ease-out",
          collapsed ? "md:w-16" : "md:w-64"
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b">
          <Link href="/" className="flex h-full w-full items-center gap-0">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center">
              <Ticket className="h-7 w-7" />
            </div>

            <span
              className={cn(
                "whitespace-nowrap text-lg font-semibold",
                "transition-[opacity,transform] duration-150 ease-out",
                collapsed
                  ? "pointer-events-none -translate-x-2 opacity-0"
                  : "translate-x-0 opacity-100"
              )}
            >
              Tickety
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex h-10 w-full items-center rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span className="flex w-10 shrink-0 items-center justify-center">
                  <Icon className="h-5 w-5" />
                </span>

                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap",
                    "transition-[opacity,transform] duration-150 ease-out",
                    collapsed
                      ? "pointer-events-none -translate-x-2 opacity-0"
                      : "translate-x-0 opacity-100"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t p-3">
          <form action={logout}>
            <button
              type="submit"
              title={collapsed ? "Log out" : undefined}
              className={cn(
                "flex h-10 w-full items-center rounded-md text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="flex w-10 shrink-0 items-center justify-center">
                <LogOut className="h-5 w-5" />
              </span>

              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap",
                  "transition-[opacity,transform] duration-150 ease-out",
                  collapsed
                    ? "pointer-events-none -translate-x-2 opacity-0"
                    : "translate-x-0 opacity-100"
                )}
              >
                Log out
              </span>
            </button>
          </form>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            title={collapsed ? "Expand" : "Collapse"}
            className="mt-1 flex h-10 w-full items-center rounded-md text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span className="flex w-10 shrink-0 items-center justify-center">
              {collapsed ? (
                <ChevronsRight className="h-5 w-5" />
              ) : (
                <ChevronsLeft className="h-5 w-5" />
              )}
            </span>

            <span
              className={cn(
                "overflow-hidden whitespace-nowrap",
                "transition-[opacity,transform] duration-150 ease-out",
                collapsed
                  ? "pointer-events-none -translate-x-2 opacity-0"
                  : "translate-x-0 opacity-100"
              )}
            >
              Collapse
            </span>
          </button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t bg-background px-4 md:hidden">
        <div className="flex h-full w-full items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <main className={cn(
        "min-h-screen transition-[margin] duration-200 ease-out",
        collapsed ? "md:ml-16" : "md:ml-64"
      )}>
        {children}
      </main>
    </div>
  );
}