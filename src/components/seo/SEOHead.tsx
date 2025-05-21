
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import * as seoUtils from '@/utils/seoUtils';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  keywords?: string;
  children?: React.ReactNode;
  noindex?: boolean;
  canonicalUrl?: string;
  therapistData?: any;
  blogData?: any;
  faqData?: {question: string, answer: string}[];
  locations?: string[];
}

export const SEOHead = ({
  title = "Connect with Therapists & Peer Support | TheraLink",
  description = "TheraLink offers secure online therapy sessions with licensed professionals and peer support. Connect via video, chat, or messaging for personalized mental health support.",
  image = "https://theralink.online/og-image.png",
  article = false,
  keywords = "online therapy, teletherapy, mental health, therapists, counseling, peer support, online counseling",
  children,
  noindex = false,
  canonicalUrl,
  therapistData,
  blogData,
  faqData,
  locations,
}: SEOProps) => {
  const { pathname } = useLocation();
  const siteUrl = "https://theralink.online";
  const url = canonicalUrl || `${siteUrl}${pathname}`;
  
  // Generate breadcrumb schema based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    const breadcrumbs = [
      { name: 'Home', url: 'https://theralink.online/' }
    ];
    
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        url: `https://theralink.online${currentPath}`
      });
    });
    
    return seoUtils.generateBreadcrumbSchema(breadcrumbs);
  };
  
  // Determine which schemas to include based on the page
  const getSchemas = () => {
    const schemas = [seoUtils.generateWebsiteSchema(), seoUtils.generateOrganizationSchema()];
    
    // Add page-specific schemas
    if (pathname === '/') {
      // Homepage needs local business info for SEO
      schemas.push(seoUtils.generateLocalBusinessSchema(locations));
    }
    
    // Add therapist schema for therapist profiles
    if (pathname.includes('/therapist/') && therapistData) {
      schemas.push(seoUtils.generateTherapistSchema(therapistData));
    }
    
    // Add blog post schema for blog posts
    if (pathname.includes('/blog/') && blogData) {
      schemas.push(seoUtils.generateBlogPostSchema(blogData));
    }
    
    // Add FAQ schema if FAQ data is provided
    if (faqData && faqData.length > 0) {
      schemas.push(seoUtils.generateFAQSchema(faqData));
    }
    
    // Add breadcrumb for all pages except homepage
    if (pathname !== '/') {
      schemas.push(generateBreadcrumbs());
    }
    
    return schemas;
  };
  
  return (
    <Helmet>
      {/* Basic Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Robots control */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* OpenGraph Tags */}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:site_name" content="TheraLink" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@theralinkapp" />
      <meta name="twitter:creator" content="@theralinkapp" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional mobile-specific meta tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="TheraLink" />
      <meta name="application-name" content="TheraLink" />
      <meta name="theme-color" content="#4f46e5" />
      
      {/* Language and direction */}
      <html lang="en" dir="ltr" />
      
      {/* Structured Data / Schema.org */}
      {getSchemas().map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      
      {/* Inject any additional SEO elements */}
      {children}
    </Helmet>
  );
};

export default SEOHead;
