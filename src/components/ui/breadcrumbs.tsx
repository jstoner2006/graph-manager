// app/ui/breadcrumbs.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ projectName }: { projectName: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm font-medium"
    >
      {/* Points cleanly back to app/projects table route */}
      <Link
        href="/projects"
        className="text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        Projects
      </Link>

      <ChevronRight className="size-4 text-slate-700 shrink-0" />

      <span
        className="text-neutral-800 truncate max-w-[240px]"
        aria-current="page"
      >
        {projectName}
      </span>
    </nav>
  );
}
