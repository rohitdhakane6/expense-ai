import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard";
import { SiteHeader } from "@/components/dashboard/site-header";
import { cn } from "@/lib/utils";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div
              data-state="expanded"
              className={cn(
                "fixed top-[var(--header-height)]",
                "h-[calc(99svh-var(--header-height))] w-full",
                "w-[calc(99svw-var(--sidebar-width))]",
                // "data-[state=collapsed]:w-[calc(100svw-var(--sidebar-width-icon))]",
                "flex flex-1 flex-col p-4",
              )}
            >
              <div className="bg-accent scrollbar-hide h-full overflow-auto rounded-2xl border">
                {children}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
