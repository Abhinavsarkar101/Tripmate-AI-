
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { UserProfile, Itinerary, TravelPreferences, Companion } from '../types';
import { MOCK_USER } from '../constants';

interface UserContextType {
  user: UserProfile & { preferences: TravelPreferences };
  itineraries: Itinerary[];
  matches: Companion[];
  bucketList: string[];
  updateUser: (profile: UserProfile, preferences: TravelPreferences) => void;
  addItinerary: (itinerary: Itinerary) => void;
  addMatch: (companion: Companion) => void;
  toggleBucketListItem: (destination: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [matches, setMatches] = useState<Companion[]>([]);
  const [bucketList, setBucketList] = useState<string[]>(['Nepal']);

  const updateUser = (profile: UserProfile, preferences: TravelPreferences) => {
    setUser({ ...profile, preferences });
  };

  const addItinerary = (itinerary: Itinerary) => {
    setItineraries(prev => [...prev, itinerary]);
  };

  const addMatch = (companion: Companion) => {
    setMatches(prev => {
      // Avoid adding duplicates
      if (prev.some(m => m.id === companion.id)) {
        return prev;
      }
      return [...prev, companion];
    });
  };

  const toggleBucketListItem = (destination: string) => {
    setBucketList(prev => 
      prev.includes(destination) 
      ? prev.filter(item => item !== destination)
      : [...prev, destination]
    );
  };

  return (
    <UserContext.Provider value={{ user, itineraries, matches, bucketList, updateUser, addItinerary, addMatch, toggleBucketListItem }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};