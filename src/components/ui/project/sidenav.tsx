"use client";
import { useState } from "react";
import Link from "next/link";
import NavLinks from "./nav-links";

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
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-slate-950 text-slate-200">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {/* ================= MANAGE PROJECT BOX ================= */}
        <div className="w-full flex flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between rounded-md p-3 text-sm font-semibold text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Bars3Icon className="w-5 h-5 text-slate-400" />
              <span>Manage Project</span>
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen
                ? "max-h-[300px] opacity-100 mt-2 pt-2 border-t border-slate-800/80"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col space-y-1">
              <NavLinks />
            </div>
          </div>
        </div>

        {/* ================= ANALYZE PROJECT BOX ================= */}
        <div className="w-full flex flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setIsAnalyzeOpen(!isAnalyzeOpen)}
            className="flex w-full items-center justify-between rounded-md p-3 text-sm font-semibold text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <PresentationChartBarIcon className="w-5 h-5 text-slate-400" />
              <span>Analyze Project</span>
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isAnalyzeOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isAnalyzeOpen
                ? "max-h-[300px] opacity-100 mt-2 pt-2 border-t border-slate-800/80"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col space-y-1">
              <AnalysisNavLinks />
            </div>
          </div>
        </div>

        {/* Flexible spacer section */}
        <div className="hidden h-auto w-full grow rounded-md bg-slate-900/20 border border-slate-900/40 md:block"></div>

        {/* ================= SIGN OUT ACTION BLOCK ================= */}
        <form className="w-full">
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-slate-900/60 border border-slate-800/50 p-3 text-sm font-medium text-slate-300 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/50 transition-all md:flex-none md:justify-start md:p-2 md:px-3 cursor-pointer">
            <PowerIcon className="w-6 text-slate-400 group-hover:text-red-400" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
