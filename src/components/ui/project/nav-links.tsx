"use client";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  ArrowPathRoundedSquareIcon,
  Square2StackIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import clsx from "clsx";

export default function NavLinks() {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();

  const links = [
    { name: "Project Summary", href: `/project/${id}`, icon: DocumentTextIcon },
    { name: "Nodes", href: `/project/${id}/editNode`, icon: Square2StackIcon },
    {
      name: "NodeTypes",
      href: `/project/${id}/editNodeType`,
      icon: UserGroupIcon,
    },
    {
      name: "Edges",
      href: `/project/${id}/editEdge`,
      icon: ArrowPathRoundedSquareIcon,
    },
    {
      name: "EdgeTypes",
      href: `/project/${id}/editEdgeType`,
      icon: DocumentDuplicateIcon,
    },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        // Mechanical Check: Evaluates true if this link matches the current URL path
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              // 1. BASE STYLES (Applies to all links in Dark Mode)
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium transition-all md:flex-none md:justify-start md:p-2 md:px-3 cursor-pointer",

              // 2. CONDITIONALS (Swaps look depending on active route state)
              {
                // INACTIVE STATE: Muted slate colors that brighten on hover
                "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100":
                  !isActive,

                // ACTIVE STATE: Distinct blue indicator popping against the dark sidebar
                "bg-blue-950/50 text-blue-400 border border-gray-100 shadow-sm shadow-blue-500/5":
                  isActive,
              },
            )}
          >
            <LinkIcon
              className={clsx("w-6 transition-colors", {
                "text-blue-400": isActive,
                "text-slate-500 group-hover:text-slate-300": !isActive,
              })}
            />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
