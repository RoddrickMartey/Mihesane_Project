import React, { useEffect } from "react";
import Header from "../Header";
import { Outlet, useLocation } from "react-router";
import Footer from "../Footer";
import CornerQuickActions from "../ui/CornerQuickActions";

function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // optional: makes it animated
    });
  }, [pathname]);
  return (
    <main>
      <Header />
      <Outlet />
      <Footer />
      <CornerQuickActions />
    </main>
  );
}

export default MainLayout;
