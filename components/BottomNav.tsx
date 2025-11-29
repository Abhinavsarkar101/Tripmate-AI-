import React from 'react';
import type { Tab } from '../types';
import { HomeIcon, UsersIcon, MapIcon, ChatBubbleLeftRightIcon, CommandLineIcon, UserCircleIcon } from './icons/Icons';
import type { IconProps } from './icons/Icons';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactElement<IconProps>;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeColor = 'text-sunset-orange';
  const inactiveColor = 'text-gray-400';
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeColor : inactiveColor}`}
    >
      {React.cloneElement(icon, { className: 'h-6 w-6' })}
      <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { tab: Tab; label: string; icon: React.ReactElement<IconProps> }[] = [
    { tab: 'home', label: 'Feed', icon: <HomeIcon /> },
    { tab: 'companions', label: 'Mates', icon: <UsersIcon /> },
    { tab: 'trips', label: 'Trips', icon: <MapIcon /> },
    { tab: 'forum', label: 'Forum', icon: <ChatBubbleLeftRightIcon /> },
    { tab: 'bot', label: 'AI Bot', icon: <CommandLineIcon /> },
    { tab: 'profile', label: 'Profile', icon: <UserCircleIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-off-white/95 backdrop-blur-sm border-t border-gray-200 flex md:justify-center z-50">
      <div className="flex w-full max-w-lg">
        {navItems.map(item => (
          <NavItem
            key={item.tab}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.tab}
            onClick={() => setActiveTab(item.tab)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;