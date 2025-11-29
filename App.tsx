import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import CompanionsPage from './pages/CompanionsPage';
import TripsPage from './pages/TripsPage';
import ForumPage from './pages/ForumPage';
import BotChatPage from './pages/BotChatPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/BottomNav';
import { Tab } from './types';
import { UserProvider } from './contexts/UserContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'companions':
        return <CompanionsPage />;
      case 'trips':
        return <TripsPage />;
      case 'forum':
        return <ForumPage />;
      case 'bot':
        return <BotChatPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  if (!isLoggedIn) {
    if (authPage === 'login') {
      return <LoginPage onLogin={handleLogin} onSwitchToSignUp={() => setAuthPage('signup')} />;
    } else {
      return <SignUpPage onSignUp={handleLogin} onSwitchToLogin={() => setAuthPage('login')} />;
    }
  }

  return (
    <UserProvider>
      <div className="h-full bg-off-white font-inter text-charcoal-gray flex flex-col">
        {/* The main content area. It will grow to fill available space and scroll internally. */}
        <main className="flex-1 overflow-y-auto pb-20">
          {renderContent()}
        </main>
        {/* The BottomNav is outside the main scrolling flow and fixed to the viewport. */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </UserProvider>
  );
};

export default App;