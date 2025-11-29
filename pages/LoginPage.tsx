import React from 'react';
import { GlobeAltIcon, LockClosedIcon } from '../components/icons/Icons';

interface LoginPageProps {
  onLogin: () => void;
  onSwitchToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignUp }) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="h-full flex items-center justify-center p-4 bg-gradient-to-br from-sky-blue to-sunset-orange font-inter">
      <div className="max-w-md w-full space-y-8 bg-off-white p-10 rounded-3xl shadow-2xl">
        <div>
          <div className="flex items-center justify-center space-x-3">
            <GlobeAltIcon className="h-10 w-10 text-sky-blue" />
            <h1 className="text-4xl font-poppins font-bold tracking-tight text-charcoal-gray">TripMate</h1>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your AI-powered travel companion
          </p>
        </div>
        
        <div className="space-y-6">
            <button
              onClick={onLogin}
              type="button"
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-2xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sunset-orange"
            >
              <LockClosedIcon className="h-5 w-5 text-yellow-500 mr-2" />
              Sign in with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-off-white text-gray-500">OR</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" name="email" type="email" autoComplete="email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-blue focus:border-sky-blue sm:text-sm" placeholder="you@example.com" />
                </div>

                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
                    <input id="password" name="password" type="password" autoComplete="current-password" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-blue focus:border-sky-blue sm:text-sm" placeholder="••••••••" />
                </div>
                
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-charcoal-gray hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-charcoal-gray"
                >
                    Log In
                </button>
            </form>
            
            <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button type="button" onClick={onSwitchToSignUp} className="font-medium text-sunset-orange hover:text-opacity-80">
                    Sign up
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;