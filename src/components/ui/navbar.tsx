// components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/75 backdrop-blur-md text-slate-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand/Logo Element */}
        <div className="flex items-center gap-2 font-bold text-white tracking-tight">
          <span className="text-blue-500 text-lg">⬢</span> Graph Manager
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center gap-6 text-sm font-medium list-none p-0 m-0">
          <li>
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="transition-colors hover:text-white"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="transition-colors hover:text-white"
            >
              Documentation
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="transition-colors hover:text-white"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
