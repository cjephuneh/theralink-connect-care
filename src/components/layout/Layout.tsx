import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

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

// Define page-specific SEO data
const getPageSeoData = (pathname: string) => {
  // Default SEO data
  let seoData = {
    title: "Connect with Therapists & Peer Support | TheraLink",
    description: "TheraLink offers secure online therapy sessions with licensed professionals and peer support. Connect via video, chat, or messaging for personalized mental health support.",
    keywords: "online therapy, teletherapy, mental health, therapists, counseling, peer support",
    noindex: false
  };
  
  // Page-specific SEO data
  const pageSeo: Record<string, any> = {
    '/': {
      title: "TheraLink | Connect with Licensed Therapists & Peer Support Online",
      description: "TheraLink offers secure online therapy sessions with licensed professionals and peer support. Connect via video, chat, or messaging for personalized mental health support.",
      keywords: "online therapy, teletherapy, mental health, therapists, counseling, peer support, mental health platform"
    },
    '/therapists': {
      title: "Find a Licensed Therapist | TheraLink",
      description: "Browse and connect with qualified, licensed therapists specializing in various mental health areas. Book secure video sessions or chat support.",
      keywords: "find therapist, licensed therapist, online therapist, video therapy, mental health professional"
    },
    '/friends': {
      title: "Peer Support Connections | TheraLink",
      description: "Connect with trained peer supporters who understand what you're going through. Get mental health support from people with lived experience.",
      keywords: "peer support, mental health peers, lived experience, emotional support, mental health community"
    },
    '/how-it-works': {
      title: "How TheraLink Works | Online Therapy & Support Process",
      description: "Learn how TheraLink connects you with licensed therapists and peer supporters through our secure platform. Simple booking, secure sessions, and ongoing support.",
      keywords: "how therapy works, online therapy process, mental health support, therapy sessions"
    },
    '/for-therapists': {
      title: "For Therapists | Join TheraLink's Professional Network",
      description: "Join TheraLink as a licensed therapist and expand your practice. Connect with clients, manage appointments, and provide secure online therapy sessions.",
      keywords: "therapist portal, therapist signup, online practice, teletherapy provider"
    },
    '/for-friends': {
      title: "Become a Friend | Peer Support on TheraLink",
      description: "Use your lived experience with mental health challenges to help others. Join TheraLink as a Friend and provide valuable peer support.",
      keywords: "peer support volunteer, mental health support, share experience, help others"
    },
    '/about': {
      title: "About TheraLink | Our Mission & Team",
      description: "Learn about TheraLink's mission to make mental health support accessible to all through technology and human connection.",
      keywords: "about TheraLink, mental health mission, therapy platform, online therapy company"
    },
    '/blog': {
      title: "Mental Health Blog | TheraLink Resources",
      description: "Explore articles, guides, and resources about mental health, therapy approaches, self-care, and wellbeing from TheraLink experts.",
      keywords: "mental health blog, therapy articles, wellbeing resources, psychology blog"
    },
    '/contact': {
      title: "Contact TheraLink | Support & Inquiries",
      description: "Get in touch with TheraLink for customer support, therapist inquiries, or partnership opportunities.",
      keywords: "contact therapy service, mental health support, customer service, help"
    },
    '/auth/login': {
      title: "Login to Your Account | TheraLink",
      description: "Sign in to access your TheraLink account, appointments, and messages.",
      keywords: "login, sign in, therapy account, mental health platform",
      noindex: true
    },
    '/auth/register': {
      title: "Create Your Account | TheraLink",
      description: "Sign up for TheraLink to connect with therapists and peer supporters for mental health support.",
      keywords: "sign up, create account, join therapy platform, mental health support",
      noindex: true
    },
    '/ai-matching': {
      title: "AI Therapist Matching | Find Your Perfect Therapy Match",
      description: "Use our intelligent matching system to find the right therapist for your specific needs, preferences, and therapy goals.",
      keywords: "find therapist match, therapy matching, best therapist for me, therapist finder"
    }
  };
  
  // Find the most specific matching path
  const matchedPath = Object.keys(pageSeo).find(path => pathname === path);
  
  // If we have specific SEO data for this path, use it
  if (matchedPath && pageSeo[matchedPath]) {
    seoData = { ...seoData, ...pageSeo[matchedPath] };
  }
  
  return seoData;
};

const Layout = () => {
  const location = useLocation();
  const { pathname } = location;
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Don't show breadcrumbs on the homepage
  const shouldShowBreadcrumbs = pathname !== '/';
  
  // Get SEO data for the current page
  const seoData = getPageSeoData(pathname);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-dot-pattern bg-dot-medium opacity-[0.03] dark:opacity-[0.05] bg-transparent dark:bg-transparent"></div>
      
      {/* Add SEO metadata for the current page */}
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        noindex={seoData.noindex}
      />
      
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
