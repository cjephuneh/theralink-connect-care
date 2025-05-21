
import React from 'react';
import SEOHead from './SEOHead';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  description?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ 
  faqs, 
  title = "Frequently Asked Questions", 
  description 
}) => {
  return (
    <section className="py-12 bg-muted/30">
      <SEOHead 
        faqData={faqs}
        title={`${title} | TheraLink`}
        description={description || "Find answers to common questions about TheraLink's online therapy and peer support services."}
      />
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            {description}
          </p>
        )}
        
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
