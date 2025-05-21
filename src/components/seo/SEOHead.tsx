
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  keywords?: string;
}

export const SEOHead = ({
  title = "Connect with Therapists & Peer Support | TheraLink",
  description = "TheraLink offers secure online therapy sessions with licensed professionals and peer support. Connect via video, chat, or messaging for personalized mental health support.",
  image = "https://theralink.online/og-image.png",
  article = false,
  keywords = "online therapy, teletherapy, mental health, therapists, counseling",
}: SEOProps) => {
  const { pathname } = useLocation();
  const siteUrl = "https://theralink.online";
  const url = `${siteUrl}${pathname}`;
  
  // Generate schema based on the current page
  const getPageSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": url,
      "name": title,
      "description": description,
      "image": image,
      "publisher": {
        "@type": "Organization",
        "name": "TheraLink",
        "logo": {
          "@type": "ImageObject",
          "url": "https://theralink.online/logo.png"
        }
      }
    };
    
    // Customize schema for specific pages
    if (pathname.includes("/therapists")) {
      return {
        ...baseSchema,
        "@type": "CollectionPage",
        "about": {
          "@type": "Thing",
          "name": "Online Therapists"
        }
      };
    }
    
    if (pathname.includes("/blog")) {
      return {
        ...baseSchema,
        "@type": "Blog",
        "headline": "TheraLink Mental Health Blog",
        "about": {
          "@type": "Thing", 
          "name": "Mental Health Resources"
        }
      };
    }
    
    if (pathname.includes("/auth/register")) {
      return {
        ...baseSchema,
        "@type": "RegisterAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://theralink.online/auth/register",
          "actionPlatform": [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/IOSPlatform",
            "https://schema.org/AndroidPlatform"
          ]
        }
      };
    }
    
    return baseSchema;
  };
  
  return (
    <Helmet>
      {/* Basic Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* OpenGraph Tags */}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={article ? "article" : "website"} />
      
      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data / Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(getPageSchema())}
      </script>
    </Helmet>
  );
};

export default SEOHead;
