import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function DarkModeToggle({ className = "" }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const userPref = localStorage.getItem("theme");
    const systemPref = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (userPref === "dark" || (!userPref && systemPref)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";

    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full bg-surface shadow text-text-soft hover:text-primary transition w-fit h-fit ${className} border-secondary border`}
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
