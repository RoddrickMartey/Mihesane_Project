import React from "react";
import { useNavigate } from "react-router";
import { Home, ArrowUp } from "lucide-react";
import Button from "@/components/ui/Button";

function CornerQuickActions() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-3 z-50">
      <Button
        icon={<Home size={18} />}
        onClick={() => navigate("/")}
        variant="secondary"
        className="shadow-md"
      >
        Home
      </Button>
      <Button
        icon={<ArrowUp size={18} />}
        onClick={scrollToTop}
        variant="outline"
        className="shadow-md"
      >
        Top
      </Button>
    </div>
  );
}

export default CornerQuickActions;
