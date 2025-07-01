import React, { useState } from "react";
import DarkModeToggle from "./ui/DarkModeToggle";
import useAuth from "@/hooks/useAuth";
import Button from "./ui/Button";
import { LogIn, Notebook, SquareUser, Menu } from "lucide-react";
import ProfileMenu from "./ui/ProfileMenu";
import { useNavigate } from "react-router";

function Header() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b-border border-b-2 w-full h-[70px] flex items-center px-5 justify-between relative">
      {/* Logo */}
      <div className="flex items-center space-x-2 text-xl font-bold">
        <Notebook size={26} />
        <h1>Misane</h1>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-3">
        <DarkModeToggle />
        {isAuthenticated ? (
          <ProfileMenu />
        ) : (
          <div className="flex gap-3">
            <Button
              icon={<LogIn size={17} />}
              iconPosition="right"
              variant="outline"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </Button>
            <Button
              icon={<SquareUser size={17} />}
              iconPosition="right"
              onClick={() => navigate("/auth/signup")}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-text-primary"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 w-48 bg-surface border border-border shadow-lg rounded-lg p-4 flex flex-col gap-3 md:hidden z-50">
          <DarkModeToggle />
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <>
              <Button
                variant="outline"
                icon={<LogIn size={16} />}
                iconPosition="right"
                onClick={() => {
                  navigate("/auth/login");
                  setMenuOpen(false);
                }}
              >
                Login
              </Button>
              <Button
                icon={<SquareUser size={16} />}
                iconPosition="right"
                onClick={() => {
                  navigate("/auth/signup");
                  setMenuOpen(false);
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
