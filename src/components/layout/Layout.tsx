
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

// Helper function to generate breadcrumb title from path segment
const formatBreadcrumbTitle = (segment: string) => {
  // Convert kebab-case or snake_case to Title Case with spaces
  return segment
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Layout = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Don't show breadcrumbs on the homepage
  const shouldShowBreadcrumbs = location.pathname !== '/';
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-dot-pattern bg-dot-medium opacity-[0.03] dark:opacity-[0.05] bg-transparent dark:bg-transparent"></div>
      
      {/* Add structured data for the current page (will be added by React Helmet) */}
      <Header />
      
      <main className="flex-grow">
        {shouldShowBreadcrumbs && pathSegments.length > 0 && (
          <div className="container mx-auto px-4 py-2 text-sm">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <Home className="h-3.5 w-3.5 mr-1" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">Home</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                
                {pathSegments.map((segment, index) => {
                  // Skip showing "auth" in the breadcrumb
                  if (segment === "auth" && pathSegments[index + 1]) {
                    return null;
                  }
                  
                  // Build the breadcrumb path up to this segment
                  const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                  const isLast = index === pathSegments.length - 1;
                  
                  // Special case for the auth/register path
                  const title = segment === "register" && pathSegments[index - 1] === "auth" 
                    ? "Register"
                    : formatBreadcrumbTitle(segment);
                  
                  return (
                    <BreadcrumbItem key={segment}>
                      {isLast ? (
                        <span aria-current="page">{title}</span>
                      ) : (
                        <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                      )}
                      {!isLast && <BreadcrumbSeparator />}
                    </BreadcrumbItem>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
        
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
