"use client";

import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DashboardProvider } from "@/contexts/DashboardContext";
import IconRail from "./IconRail";
import SecondarySidebar from "./SecondarySidebar";
import MobileNav from "./MobileNav";
import ThemeToggle from "@/components/ThemeToggle";

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const showPlayerSidebar = pathname.startsWith("/dashboard/team");

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="app-canvas">
      <div className="app-shell">
        <IconRail onSignOut={handleSignOut} />
        {showPlayerSidebar && (
          <Suspense
            fallback={
              <aside className="panel-sidebar hidden lg:flex flex-col w-[280px] shrink-0" />
            }
          >
            <SecondarySidebar />
          </Suspense>
        )}
        <main className="main-panel">
          <div className="main-panel-inner content-inner page-content">
            {children}
          </div>
        </main>
      </div>
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <MobileNav />
    </div>
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <ShellInner>{children}</ShellInner>
    </DashboardProvider>
  );
}
