
import React from "react";
import { Link } from "react-router-dom";

const HIPAAPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-8">HIPAA Compliance</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Last Updated: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment to HIPAA Compliance</h2>
          <p>
            TheraLink is committed to compliance with the Health Insurance Portability and Accountability Act (HIPAA) of 1996 and its implementing regulations. We understand the importance of protecting your health information and take our responsibilities seriously.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Protected Health Information (PHI)</h2>
          <p>
            Protected Health Information (PHI) includes any individually identifiable health information that relates to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>An individual's past, present, or future physical or mental health or condition</li>
            <li>The provision of health care to the individual</li>
            <li>The past, present, or future payment for the provision of health care to the individual</li>
          </ul>
          <p className="mt-2">
            This includes information that identifies the individual or provides a reasonable basis to believe it can be used to identify the individual.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Protect Your Information</h2>
          <p>
            TheraLink implements a variety of security measures to maintain the safety of your PHI, including:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Encryption</strong>: All data transmitted between your device and our servers is encrypted using industry-standard protocols.</li>
            <li><strong>Secure Storage</strong>: PHI is stored in secure, HIPAA-compliant environments with appropriate physical, technical, and administrative safeguards.</li>
            <li><strong>Access Controls</strong>: Only authorized personnel have access to PHI, and such access is limited to the minimum necessary information.</li>
            <li><strong>Audit Trails</strong>: We maintain detailed logs of who accesses PHI and when.</li>
            <li><strong>Business Associate Agreements</strong>: We enter into HIPAA-compliant business associate agreements with third parties who receive PHI from us.</li>
            <li><strong>Staff Training</strong>: Our staff receives regular training on HIPAA compliance and the importance of protecting PHI.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights Under HIPAA</h2>
          <p>
            HIPAA provides you with certain rights regarding your health information, including:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>The right to access your health information</li>
            <li>The right to request corrections to your health information</li>
            <li>The right to receive an accounting of disclosures of your health information</li>
            <li>The right to request restrictions on certain uses and disclosures of your health information</li>
            <li>The right to request confidential communications</li>
            <li>The right to receive a notice of privacy practices</li>
            <li>The right to file a complaint if you believe your privacy rights have been violated</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Breach Notification</h2>
          <p>
            In the event of a breach of unsecured PHI, we will notify affected individuals in accordance with HIPAA requirements. This notification will include:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>A description of the breach</li>
            <li>The types of information involved in the breach</li>
            <li>Steps individuals should take to protect themselves</li>
            <li>A description of what we are doing to investigate the breach, mitigate harm, and prevent future breaches</li>
            <li>Contact information for individuals to ask questions or receive additional information</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p>
            If you have any questions about our HIPAA compliance or would like to exercise your rights under HIPAA, please contact our Privacy Officer at <a href="mailto:privacy@theralink.com" className="text-thera-600 hover:underline">privacy@theralink.com</a>.
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

export default HIPAAPage;
