import React from 'react';

export const WelcomeHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">Welcome back, user!</h1>
      <p className="text-gray-400">Your secure vault is synchronized and active.</p>
    </div>
  );
};
