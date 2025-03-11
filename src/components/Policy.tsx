import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 hover:text-indigo-600 transition-colors">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm">
              Effective Date: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            <div title="Data We Collect">
              <ul className="list-disc pl-6 space-y-4">
                <li>Personal information you provide (name, email, etc.)</li>
                <li>Automatically collected usage data</li>
                <li>Third-party analytics data</li>
              </ul>
            </div>

            <div title="How We Use Your Data">
              <p>
                We use your information to provide and improve our services, 
                communicate with you, and for legal compliance.
              </p>
            </div>

            <div title="Data Sharing">
              <p>
                We only share your data with third parties when necessary for 
                service provision or when required by law.
              </p>
            </div>

            <div title="Your Rights">
              <ul className="list-disc pl-6 space-y-4">
                <li>Right to access your personal data</li>
                <li>Right to request deletion</li>
                <li>Right to opt-out of data collection</li>
              </ul>
            </div>

            <div title="Data Security">
              <p>
                We implement industry-standard security measures including 
                encryption and access controls to protect your information.
              </p>
            </div>

            <div title="International Transfers">
              <p>
                Your data may be transferred to and processed in countries 
                outside your residence, including [List Countries].
              </p>
            </div>

            <div className="mt-12 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Our DPO
              </h3>
              <p className="text-indigo-600 hover:text-indigo-800 transition-colors">
                <a href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;