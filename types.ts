export type Tab = 'home' | 'companions' | 'trips' | 'forum' | 'bot' | 'profile';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  interests: string[];
  travelStyle: 'Adventure' | 'Leisure' | 'Cultural' | 'Backpacking' | 'Luxury';
  preferredDestinations: string[];
  profilePicture: string;
}

export interface TravelPreferences {
  budget: 'Low' | 'Medium' | 'High';
  travelType: 'Solo' | 'Group' | 'Couple';
  groupSize: '2-4' | '5-10' | '10+';
  duration: 'Weekend' | '1-2 Weeks' | '2+ Weeks';
  activityLevel: 'Relaxed' | 'Moderate' | 'High';
  climate: 'Hot' | 'Cold' | 'Moderate';
}

export interface Companion extends UserProfile {
  id: number;
  similarityScore: number;
  preferences: TravelPreferences;
  gallery: string[];
}

export interface TransportDetails {
  type: 'Tempo Traveller' | 'Bus' | 'Train' | 'Flight';
  amenities: ('AC' | 'Non-AC')[];
}

export interface TravelPackage {
  id: number;
  company: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  tags: string[];
  startLocation: string;
  destination: string;
  imageUrl: string;
  departureDate: string; // YYYY-MM-DD
  isWeekendTrip: boolean;
  transport: TransportDetails;
}

export interface Comment {
  id: number;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  replies?: Comment[];
}

export interface SocialPost {
  id: number;
  username: string;
  userAvatar: string;
  caption: string;
  destinationTag: string;
  imageUrl: string;
  likes: number;
  commentsCount: number;
  commentData: Comment[];
  shares: number;
  isBookmarked: boolean;
  timestamp: string;
}

export interface ForumReply {
  id: number;
  username: string;
  userAvatar: string;
  reply: string;
  isAI?: boolean;
}

export interface ForumPost {
  id: number;
  username: string;
  userAvatar: string;
  question: string;
  category: 'Mountains' | 'Beaches' | 'Cities';
  replies: ForumReply[];
}

export interface Itinerary {
  id: string;
  destination: string;
  plan: { day: number; activities: string }[];
  notes: string;
  isPublic: boolean;
}

export interface ChatMessage {
  text: string;
  timestamp: string;
  sender: 'me' | 'them';
}

export interface Chat {
  id: number;
  companionId: number;
  messages: ChatMessage[];
}

export interface IcebreakerRequest {
  id: number;
  sender: Companion;
  message: string;
  timestamp: string;
}


// --- AI Bot Types ---

export interface TravelPlanRequest {
    userName?: string;
    startPoint?: string;
    destination?: string;
    durationInDays?: number;
    budget?: 'Budget-friendly' | 'Mid-range' | 'Luxury';
    travelStyle?: 'Solo' | 'Couple' | 'Group' | 'Family';
    transportMode?: 'Flight' | 'Train' | 'Bus';
    interests?: string[];
}

export type BotQuestion = keyof Omit<TravelPlanRequest, 'interests' | 'userName'> | 'interests' | null;


export type TransportType = 'Flight' | 'Train' | 'Bus' | 'Taxi' | 'Walk';

export interface TransportOption {
    type: TransportType;
    name: string;
    departureTime: string;
    arrivalTime: string;
}

export interface Recommendation {
    name: string;
    description: string;
    imageUrl: string;
}

export interface ItineraryItem {
    time: string;
    place: Recommendation;
    transportToNext?: TransportOption;
}

export interface StructuredBotResponse {
    introduction: string;
    initialTransport: TransportOption;
    hotelRecommendation: Recommendation;
    itinerary: {
        day: number;
        activities: ItineraryItem[];
    }[];
}