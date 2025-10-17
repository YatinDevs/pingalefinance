import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppPopup from "../components/PopUp/WhatsAppPopup";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className=" min-h-[calc(100vh-120px)]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppPopup />
    </>
  );
}

export default Layout;
