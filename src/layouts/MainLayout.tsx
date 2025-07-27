// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { NavbarH } from "../components/Home/Navbarh"; // adjust path as needed
import FooterP from "../components/patientdashboard/fotterP";

const MainLayout = () => {
  return (
    <>
      <NavbarH />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <FooterP/>
    </>
  );
};

export default MainLayout;
