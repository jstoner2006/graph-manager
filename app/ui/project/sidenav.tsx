"use client";
import { useState } from "react";
import Link from "next/link";
import NavLinks from "@/app/ui/project/nav-links";
import AnalysisNavLinks from "./analysis-nav-links";
import HomeLogo from "../home-logo";
import {
  PowerIcon,
  ChevronDownIcon,
  Bars3Icon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import AcmeLogo from "../acme-logo";

import { Client } from "pg";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <div className="w-full flex flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
          {/* 3. Outer Menu Button: Toggles the display of nested links */}
          {/* 3. Outer Menu Button: Toggles the display of nested links */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between rounded-md p-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Bars3Icon className="w-5 h-5 text-gray-500" />
              <span>Manage Project</span>
            </div>
            {/* Smoothly rotates arrow icon when menu status updates */}
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* 4. Collapsible Content Shell */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen
                ? "max-h-[300px] opacity-100 mt-2 pt-2 border-t border-gray-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {/* Your unmodified active links nested inside */}
            <div className="flex flex-col space-y-1">
              <NavLinks />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
          {/* 3. Outer Menu Button: Toggles the display of nested links */}
          {/* 3. Outer Menu Button: Toggles the display of nested links */}
          <button
            onClick={() => setIsAnalyzeOpen(!isAnalyzeOpen)}
            className="flex w-full items-center justify-between rounded-md p-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <PresentationChartBarIcon className="w-5 h-5 text-gray-500" />
              <span>Analyze Project</span>
            </div>
            {/* Smoothly rotates arrow icon when menu status updates */}
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isAnalyzeOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* 4. Collapsible Content Shell */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isAnalyzeOpen
                ? "max-h-[300px] opacity-100 mt-2 pt-2 border-t border-gray-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {/* Your unmodified active links nested inside */}
            <div className="flex flex-col space-y-1">
              <AnalysisNavLinks />
            </div>
          </div>
        </div>

        {/* Flexible spacer section */}
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

        {/* Sign out action block */}
        <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
