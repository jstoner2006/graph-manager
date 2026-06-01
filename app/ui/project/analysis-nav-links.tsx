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

export default function AnalysisNavLinks() {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();

  const links = [
    {
      name: "Shortest Paths",
      href: `/project/${id}`,
      icon: DocumentTextIcon,
    },
    {
      name: "Dependency Analysis",
      href: `/project/${id}/editNode`,
      icon: Square2StackIcon,
    },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
