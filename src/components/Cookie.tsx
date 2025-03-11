import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupLoaded, setPopupLoaded] = useState(false);

  useEffect(() => {
    const checkCookie = (name: string): boolean => {
      return document.cookie.split('; ').some((cookie) => cookie.startsWith(name + '='));
    };

    const showPopupIfNecessary = () => {
      if (!checkCookie('cookieConsent')) {
        setTimeout(() => {
          setShowPopup(true);
          setTimeout(() => setPopupLoaded(true), 10);
        }, 500);
      }
    };

    showPopupIfNecessary();
  }, []);

  const setCookie = (name: string, value: string, days: number): void => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  };

  const handleAccept = () => {
    setCookie('cookieConsent', 'accepted', 365);
    setPopupLoaded(false);
    setTimeout(() => setShowPopup(false), 200);
    console.log('User accepted cookies.');
  };

  const handleReject = () => {
    setCookie('cookieConsent', 'rejected', 30);
    setPopupLoaded(false);
    setTimeout(() => setShowPopup(false), 200);
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 w-full p-4 sm:p-8 bg-white border-t border-gray-200 shadow-lg z-50 transition-opacity duration-300 transform translate-y-0 sm:bottom-8 sm:left-8 sm:w-auto sm:border sm:rounded-2xl sm:shadow-xl ${
        popupLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full sm:translate-y-0'
      }`}
    >
      <div className="flex items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-500 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 className="text-lg font-semibold">Cookie Consent</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept," you consent to our use of cookies.
      </p>
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={handleAccept}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-sm font-medium transition duration-200"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 px-6 rounded-lg text-sm font-medium transition duration-200"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;