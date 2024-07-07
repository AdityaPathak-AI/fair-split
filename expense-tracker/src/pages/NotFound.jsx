// NotFound.js
import React from 'react';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100">
      <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">404 - Not Found</h2>
        <p className="text-gray-600 mb-8">Oops! The page you're looking for does not exist.</p>
        <a href="/" className="text-primary hover:underline">Go back to home</a>
      </div>
    </div>
  );
}

export default NotFound;
