
import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Last Updated: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            TheraLink ("we," "our," or "us") is committed to protecting the privacy of individuals who visit our website, mobile application, and use our services (collectively, the "Services"). This Privacy Policy outlines how we collect, use, disclose, and safeguard your information.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>
              <strong>Personal Information</strong>: Information that identifies you personally, such as your name, email address, phone number, and date of birth.
            </li>
            <li>
              <strong>Health Information</strong>: Information related to your mental health, including any information you provide during therapy sessions or through our platform.
            </li>
            <li>
              <strong>Payment Information</strong>: Information necessary to process payments, such as credit/debit card details or other payment methods.
            </li>
            <li>
              <strong>Usage Information</strong>: Information about how you use our Services, including log data, device information, and cookies.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>To provide and maintain our Services</li>
            <li>To connect you with therapists and facilitate therapy sessions</li>
            <li>To process payments and manage your account</li>
            <li>To improve our Services and develop new features</li>
            <li>To communicate with you about our Services, including updates and support</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. HIPAA Compliance</h2>
          <p>
            TheraLink is committed to complying with the Health Insurance Portability and Accountability Act (HIPAA). We implement physical, technical, and administrative safeguards to protect your health information.
          </p>
          <p className="mt-2">
            We will not use or disclose your health information except as permitted by HIPAA and with your authorization when required.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>
              <strong>Therapists</strong>: We share your information with the therapists you choose to connect with on our platform.
            </li>
            <li>
              <strong>Service Providers</strong>: We work with third-party service providers to help us operate, provide, and improve our Services.
            </li>
            <li>
              <strong>Legal Requirements</strong>: We may disclose your information when required by law or in response to legal processes.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p>
            We implement reasonable and appropriate security measures to protect your information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate personal information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to restrict or object to processing of your personal information</li>
            <li>The right to data portability</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p>
            Our Services are not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material changes to this Privacy Policy, we will notify you by email or through our Services. Your continued use of our Services after such notification constitutes your acceptance of the updated Privacy Policy.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at <a href="mailto:privacy@theralink.com" className="text-thera-600 hover:underline">privacy@theralink.com</a>.
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

export default PrivacyPolicyPage;
