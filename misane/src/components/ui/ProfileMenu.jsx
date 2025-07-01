import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router";

export default function ProfileMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!isAuthenticated) return null;

  const initials = `${user.firstname?.[0] || ""}${
    user.surname?.[0] || ""
  }`.toUpperCase();

  const initialOthername = `${user.othername?.[0] || ""}`.toUpperCase();
  const fullname = `${user.firstname} ${initialOthername}. ${user.surname}`;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 bg-surface border border-border rounded-full hover:bg-muted transition"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-sm font-semibold text-text-soft">
            {initials || "U"}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-surface border border-border shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h6 className="text-base font-heading font-medium text-text-primary leading-snug">
              {user.title} {fullname}
            </h6>
            <p className="text-xs text-text-soft truncate">{user.email}</p>
          </div>

          <button
            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-muted text-sm text-left transition hover:bg-accent"
            onClick={() => {
              setOpen(false);
              navigate("/user/setting");
            }}
          >
            <User size={16} />
            Profile
          </button>

          <button
            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-muted text-sm text-left text-red-600 transition hover:bg-accent"
            onClick={logout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
