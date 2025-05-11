
import React from "react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Last Updated: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to TheraLink ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of our website, mobile application, and services (collectively, the "Services").
          </p>
          <p className="mt-2">
            By using our Services, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not access or use our Services.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you meet this eligibility requirement.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
          <p>
            To access certain features of our Services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p className="mt-2">
            You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Therapist Services</h2>
          <p>
            TheraLink is a platform that connects clients with licensed therapists. We do not provide therapy services directly; we facilitate connections between clients and independent therapists.
          </p>
          <p className="mt-2">
            Therapists on TheraLink are independent contractors, not employees of TheraLink. We are not responsible for the quality of therapy services provided by therapists on our platform.
          </p>
          <p className="mt-2">
            Therapy sessions conducted through our platform are not intended to replace emergency services. If you are experiencing a mental health emergency, please call your local emergency services immediately.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Payment and Fees</h2>
          <p>
            By using our Services, you agree to pay all fees associated with the services you select. Fees are non-refundable except as expressly provided in these Terms or required by law.
          </p>
          <p className="mt-2">
            Payment processing services are provided by third-party payment processors. By using our Services, you agree to the terms and conditions of these payment processors.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>
          <p>
            The Services and all content and materials included on or within the Services, including, but not limited to, text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, are the property of TheraLink or its content suppliers and are protected by applicable copyright, trademark, and other intellectual property laws.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, TheraLink shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of our Services.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. If we make material changes to these Terms, we will notify you by email or through the Services. Your continued use of the Services after such notification constitutes your acceptance of the modified Terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account and access to the Services at any time and for any reason, including, but not limited to, violation of these Terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:support@theralink.com" className="text-thera-600 hover:underline">support@theralink.com</a>.
          </p>
        </section>
        
        <div className="mt-8">
          <Link to="/" className="text-thera-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
