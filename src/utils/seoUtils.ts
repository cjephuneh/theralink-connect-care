
// SEO Utilities for structured data generation

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BlogPostingData {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  image?: string;
  category?: string;
}

interface TherapistData {
  name: string;
  description: string;
  image: string;
  specialty: string[];
  reviewCount?: number;
  ratingValue?: number;
  location?: string;
}

// Generic schema type to avoid TypeScript errors
type SchemaType = Record<string, any>;

/**
 * Generates breadcrumb structured data for SEO
 */
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]): SchemaType => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

/**
 * Generates FAQ structured data for SEO
 */
export const generateFAQSchema = (faqs: {question: string, answer: string}[]): SchemaType => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Generates local business structured data for TheraLink
 */
export const generateLocalBusinessSchema = (locations: string[] = []): SchemaType => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "TheraLink",
    "url": "https://theralink.online",
    "logo": "https://theralink.online/logo.png",
    "image": "https://theralink.online/og-image.png",
    "description": "TheraLink offers secure online therapy sessions with licensed professionals and peer support. Connect via video, chat, or messaging for personalized mental health support.",
    "telephone": "+254708419386",
    "priceRange": "₦₦-₦₦₦₦",
    "sameAs": [
      "https://twitter.com/theralinkapp",
      "https://facebook.com/theralinkapp",
      "https://instagram.com/theralinkapp",
      "https://linkedin.com/company/theralink"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+18001234567",
        "contactType": "customer service",
        "availableLanguage": ["English"]
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    ]
  };

  if (locations.length > 0) {
    return {
      ...baseSchema,
      "location": locations.map(location => ({
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location
        }
      }))
    };
  }

  return baseSchema;
};

/**
 * Generates therapist profile structured data
 */
export const generateTherapistSchema = (data: TherapistData): SchemaType => {
  const schema: SchemaType = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": data.name,
    "description": data.description,
    "image": data.image,
    "url": `https://theralink.online/therapist/${data.name.toLowerCase().replace(/\s+/g, '-')}`,
    "jobTitle": "Licensed Therapist",
    "knowsAbout": data.specialty
  };

  // Add review data if available
  if (data.reviewCount && data.ratingValue) {
    schema.review = {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": data.ratingValue,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "TheraLink Patients"
      }
    };
    
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": data.ratingValue,
      "reviewCount": data.reviewCount,
      "bestRating": "5"
    };
  }

  return schema;
};

/**
 * Generates blog post structured data
 */
export const generateBlogPostSchema = (data: BlogPostingData): SchemaType => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": data.headline,
    "description": data.description,
    "author": {
      "@type": "Person",
      "name": data.author
    },
    "datePublished": data.datePublished,
    "image": data.image || "https://theralink.online/og-image.png",
    "publisher": {
      "@type": "Organization",
      "name": "TheraLink",
      "logo": {
        "@type": "ImageObject",
        "url": "https://theralink.online/logo.png"
      }
    },
    "articleSection": data.category || "Mental Health",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://theralink.online/blog/${data.headline.toLowerCase().replace(/\s+/g, '-')}`
    },
    "url": `https://theralink.online/blog/${data.headline.toLowerCase().replace(/\s+/g, '-')}`,
    "name": data.headline
  };
};

/**
 * Generates WebSite structured data
 */
export const generateWebsiteSchema = (): SchemaType => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://theralink.online/",
    "name": "TheraLink",
    "description": "Connect with licensed therapists and peer supporters for secure video sessions, messaging, and personalized mental health support.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://theralink.online/therapists?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};

/**
 * Generates the Organization schema with social profiles
 */
export const generateOrganizationSchema = (): SchemaType => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TheraLink",
    "url": "https://theralink.online",
    "logo": "https://theralink.online/logo.png",
    "sameAs": [
      "https://twitter.com/theralinkapp",
      "https://facebook.com/theralinkapp",
      "https://instagram.com/theralinkapp",
      "https://linkedin.com/company/theralink"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+18001234567",
        "contactType": "customer service",
        "availableLanguage": ["English"]
      }
    ]
  };
};
