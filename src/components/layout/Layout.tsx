
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-dot-pattern bg-dot-small opacity-[0.03] dark:opacity-[0.05] bg-transparent dark:bg-transparent"></div>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
