import useAuth from "@/hooks/useAuth";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

function ProtectLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user === null || !isAuthenticated) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  return <Outlet />;
}

export default ProtectLayout;
