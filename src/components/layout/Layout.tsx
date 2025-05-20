
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  
  // Check if we're on an auth page to potentially modify layout
  const isAuthPage = location.pathname.startsWith('/auth/');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-dot-pattern bg-dot-medium opacity-[0.03] dark:opacity-[0.05] bg-transparent dark:bg-transparent"></div>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
