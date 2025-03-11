import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 hover:text-indigo-600 transition-colors">
              Terms of Service
            </h1>
            <p className="text-gray-500 text-sm">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-gray-700">
            <div title="Introduction">
              <p>
                Welcome to [Your Company Name]! These Terms of Service govern your use of our 
                website and services. By accessing or using our services, you agree to be bound 
                by these terms.
              </p>
            </div>

            <div title="User Responsibilities">
              <ul className="list-disc pl-6 space-y-4">
                <li>You must be at least 18 years old to use our services</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree not to engage in any illegal activities using our services</li>
              </ul>
            </div>

            <div title="Intellectual Property">
              <p>
                All content on this platform, including text, graphics, logos, and software, 
                is the property of [Your Company Name] and protected by intellectual property laws.
              </p>
            </div>

            <div title="Termination">
              <p>
                We reserve the right to terminate or suspend access to our services immediately, 
                without prior notice, for any reason whatsoever.
              </p>
            </div>

            <div title="Disclaimers">
              <p>
                Our services are provided "as is" without warranties of any kind. We do not 
                guarantee uninterrupted or error-free service.
              </p>
            </div>

            <div title="Limitation of Liability">
              <p>
                [Your Company Name] shall not be liable for any indirect, incidental, or 
                consequential damages resulting from the use of our services.
              </p>
            </div>

            <div title="Governing Law">
              <p>
                These terms shall be governed by and construed in accordance with the laws of 
                [Your Country/State] without regard to its conflict of law provisions.
              </p>
            </div>

            <div title="Changes to Terms">
              <p>
                We may revise these terms at any time. By continuing to use our services after 
                revisions become effective, you agree to be bound by the updated terms.
              </p>
            </div>

            <div className="mt-12 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-indigo-600 hover:text-indigo-800 transition-colors">
                <a href="mailto:legal@yourcompany.com">legal@yourcompany.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TermsOfService;