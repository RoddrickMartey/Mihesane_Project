import React from "react";
import { GitBranch, Notebook } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface text-text-soft py-6 px-4 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        {/* Left: Project Logo & Name */}
        <div className="flex items-center gap-2 font-medium text-text-primary">
          <Notebook size={18} />
          <span>Misane</span>
        </div>

        {/* Middle: GitHub link */}
        <a
          href="https://github.com/your-github-username/misane"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline text-text-soft hover:text-primary transition"
        >
          <GitBranch size={16} />
          <span>View on GitHub</span>
        </a>

        {/* Right: Copyright */}
        <div className="text-xs text-text-soft text-center md:text-right">
          &copy; {new Date().getFullYear()} Misane. Built by Roddrick.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
