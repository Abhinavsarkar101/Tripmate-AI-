import type { UserProfile, TravelPreferences, Companion, TravelPackage, SocialPost, ForumPost, Chat, Comment, IcebreakerRequest } from './types';

export const MOCK_USER: UserProfile & { preferences: TravelPreferences } = {
  name: 'Alex Doe',
  age: 28,
  gender: 'Male',
  interests: ['Hiking', 'Photography', 'Foodie'],
  travelStyle: 'Adventure',
  preferredDestinations: ['Himalayas', 'Southeast Asia'],
  profilePicture: 'https://i.pravatar.cc/150?u=alexdoe',
  preferences: {
    budget: 'Medium',
    travelType: 'Group',
    groupSize: '2-4',
    duration: '1-2 Weeks',
    activityLevel: 'High',
    climate: 'Cold',
  },
};

export const MOCK_COMPANIONS: Companion[] = [
  {
    id: 1,
    name: 'Sarah',
    age: 26,
    gender: 'Female',
    interests: ['Yoga', 'Beaches', 'Reading', 'Sunsets'],
    travelStyle: 'Leisure',
    preferredDestinations: ['Bali', 'Thailand'],
    profilePicture: 'https://picsum.photos/seed/sarahsmith/400/600',
    gallery: [
      'https://picsum.photos/seed/sarahsmith/400/600',
      'https://picsum.photos/seed/sarahbeach/400/600',
      'https://picsum.photos/seed/sarahyoga/400/600',
    ],
    similarityScore: 78,
    preferences: { budget: 'Medium', travelType: 'Solo', groupSize: '2-4', duration: '1-2 Weeks', activityLevel: 'Relaxed', climate: 'Hot' },
  },
  {
    id: 2,
    name: 'Ben',
    age: 31,
    gender: 'Male',
    interests: ['Trekking', 'History', 'Rock Climbing'],
    travelStyle: 'Adventure',
    preferredDestinations: ['Peru', 'Nepal'],
    profilePicture: 'https://picsum.photos/seed/bencarter/400/600',
    gallery: [
      'https://picsum.photos/seed/bencarter/400/600',
      'https://picsum.photos/seed/benclimbing/400/600',
      'https://picsum.photos/seed/benperu/400/600',
    ],
    similarityScore: 92,
    preferences: { budget: 'Medium', travelType: 'Group', groupSize: '2-4', duration: '1-2 Weeks', activityLevel: 'High', climate: 'Cold' },
  },
  {
    id: 3,
    name: 'Chloe',
    age: 29,
    gender: 'Female',
    interests: ['Art', 'Museums', 'Cuisine', 'Wine Tasting'],
    travelStyle: 'Cultural',
    preferredDestinations: ['Italy', 'Japan'],
    profilePicture: 'https://picsum.photos/seed/chloedavis/400/600',
    gallery: [
      'https://picsum.photos/seed/chloedavis/400/600',
      'https://picsum.photos/seed/chloeitaly/400/600',
      'https://picsum.photos/seed/chloeart/400/600',
    ],
    similarityScore: 65,
    preferences: { budget: 'High', travelType: 'Couple', groupSize: '2-4', duration: '1-2 Weeks', activityLevel: 'Moderate', climate: 'Moderate' },
  },
  {
    id: 4,
    name: 'Mark',
    age: 27,
    gender: 'Male',
    interests: ['Parties', 'Beaches', 'Music Festivals'],
    travelStyle: 'Leisure',
    preferredDestinations: ['Ibiza', 'Goa'],
    profilePicture: 'https://picsum.photos/seed/markevans/400/600',
    gallery: [
      'https://picsum.photos/seed/markevans/400/600',
      'https://picsum.photos/seed/markparty/400/600',
      'https://picsum.photos/seed/markbeach/400/600',
    ],
    similarityScore: 40,
    preferences: { budget: 'Low', travelType: 'Group', groupSize: '5-10', duration: 'Weekend', activityLevel: 'Relaxed', climate: 'Hot' },
  },
  {
    id: 5,
    name: 'Liam',
    age: 30,
    gender: 'Male',
    interests: ['Hiking', 'Wildlife', 'Camping'],
    travelStyle: 'Adventure',
    preferredDestinations: ['Andes', 'Canadian Rockies'],
    profilePicture: 'https://picsum.photos/seed/liamwilson/400/600',
    gallery: [
      'https://picsum.photos/seed/liamwilson/400/600',
      'https://picsum.photos/seed/liamcamping/400/600',
      'https://picsum.photos/seed/liamwildlife/400/600',
    ],
    similarityScore: 88,
    preferences: { budget: 'Medium', travelType: 'Group', groupSize: '2-4', duration: '2+ Weeks', activityLevel: 'High', climate: 'Cold' },
  },
];

export const MOCK_TRAVEL_PACKAGES: TravelPackage[] = [
    { 
        id: 1, 
        company: 'TripperTrails', 
        title: 'Spiti Valley Winter Expedition', 
        description: 'A thrilling 8-day trip through the frozen landscapes of Spiti.', 
        price: 25000, 
        duration: '8 Days', 
        tags: ['Trekking', 'Adventure'], 
        startLocation: 'Manali',
        destination: 'Spiti Valley', 
        imageUrl: 'https://picsum.photos/seed/spiti/400/300',
        departureDate: '2024-12-21',
        isWeekendTrip: false,
        transport: { type: 'Tempo Traveller', amenities: ['Non-AC'] }
    },
    { 
        id: 2, 
        company: 'Tripbae', 
        title: 'Goa Beach Paradise Getaway', 
        description: 'Relax and unwind on the beautiful beaches of North Goa.', 
        price: 15000, 
        duration: '3 Days', 
        tags: ['Beach', 'Weekend Getaway'], 
        startLocation: 'Bangalore',
        destination: 'Goa', 
        imageUrl: 'https://picsum.photos/seed/goa/400/300',
        departureDate: '2024-11-15',
        isWeekendTrip: true,
        transport: { type: 'Bus', amenities: ['AC'] }
    },
    { 
        id: 3, 
        company: 'TripperTrails', 
        title: 'Mystical Rajasthan Cultural Tour', 
        description: 'Explore the majestic forts and palaces of Jaipur and Jodhpur.', 
        price: 30000, 
        duration: '7 Days', 
        tags: ['Cultural', 'Cities'], 
        startLocation: 'Delhi',
        destination: 'Rajasthan', 
        imageUrl: 'https://picsum.photos/seed/rajasthan/400/300',
        departureDate: '2024-11-23',
        isWeekendTrip: false,
        transport: { type: 'Train', amenities: ['AC'] }
    },
    { 
        id: 4, 
        company: 'Tripbae', 
        title: 'Rishikesh Adventure Rush', 
        description: 'Experience river rafting, bungee jumping, and camping by the Ganges.', 
        price: 12000, 
        duration: '3 Days', 
        tags: ['Adventure', 'Weekend Getaway'], 
        startLocation: 'Delhi',
        destination: 'Rishikesh', 
        imageUrl: 'https://picsum.photos/seed/rishikesh/400/300',
        departureDate: '2024-11-29',
        isWeekendTrip: true,
        transport: { type: 'Tempo Traveller', amenities: ['AC'] }
    },
];

const MOCK_COMMENTS_POST_1: Comment[] = [
    {
        id: 101, username: 'Ben Carter', userAvatar: 'https://i.pravatar.cc/150?u=bencarter', text: 'Stunning shot! Adding this to my list.', timestamp: '1h ago',
        replies: [
            { id: 103, username: 'Sarah Smith', userAvatar: 'https://i.pravatar.cc/150?u=sarahsmith', text: 'You totally should! It was even better in person.', timestamp: '30m ago' }
        ]
    },
    { id: 102, username: 'Chloe Davis', userAvatar: 'https://i.pravatar.cc/150?u=chloedavis', text: 'Wow, incredible colors!', timestamp: '45m ago' }
];

const MOCK_COMMENTS_POST_2: Comment[] = [
    { id: 201, username: 'Liam Wilson', userAvatar: 'https://i.pravatar.cc/150?u=liamwilson', text: 'That is a serious achievement, congrats!', timestamp: '1d ago' }
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
    { id: 1, username: 'Sarah Smith', userAvatar: 'https://i.pravatar.cc/150?u=sarahsmith', caption: 'Sunrise at Tiger Hill was absolutely breathtaking! 🌅', destinationTag: 'Darjeeling', imageUrl: 'https://picsum.photos/seed/darjeeling/600/400', likes: 124, commentsCount: 12, commentData: MOCK_COMMENTS_POST_1, shares: 5, isBookmarked: false, timestamp: '2h ago' },
    { id: 2, username: 'Ben Carter', userAvatar: 'https://i.pravatar.cc/150?u=bencarter', caption: 'Conquered the Everest Base Camp trek! Feeling on top of the world.', destinationTag: 'Nepal', imageUrl: 'https://picsum.photos/seed/ebc/600/400', likes: 532, commentsCount: 45, commentData: MOCK_COMMENTS_POST_2, shares: 22, isBookmarked: true, timestamp: '1d ago' },
    { id: 3, username: 'Alex Doe', userAvatar: 'https://i.pravatar.cc/150?u=alexdoe', caption: 'Found this hidden gem of a cafe in the lanes of Ooty.', destinationTag: 'Ooty', imageUrl: 'https://picsum.photos/seed/ooty/600/400', likes: 88, commentsCount: 7, commentData: [], shares: 2, isBookmarked: false, timestamp: '5h ago' },
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
    {
        id: 1, username: 'NewTraveler', userAvatar: 'https://i.pravatar.cc/150?u=newtraveler', question: 'Is Spiti Valley accessible in December for a first-timer?', category: 'Mountains',
        replies: [
            { id: 1, username: 'SeasonedHiker', userAvatar: 'https://i.pravatar.cc/150?u=seasonedhiker', reply: 'It\'s very challenging due to snow and extreme cold. Roads can be blocked. It\'s better to go with an experienced group if you\'re a first-timer.' },
            { id: 2, username: 'TripMate AI', userAvatar: 'https://i.pravatar.cc/150?u=tripbot', reply: 'The Leh-Manali highway is typically closed from October/November to May/June due to heavy snowfall. It\'s advisable to check official sources like the Border Roads Organisation (BRO) for real-time updates before planning your travel.', isAI: true },
        ]
    },
    {
        id: 2, username: 'BeachLover', userAvatar: 'https://i.pravatar.cc/150?u=beachlover', question: 'Best quiet beaches in South Goa?', category: 'Beaches',
        replies: [
            { id: 1, username: 'GoaFan', userAvatar: 'https://i.pravatar.cc/150?u=goafan', reply: 'Definitely check out Palolem and Agonda beach. They are much quieter and cleaner than the northern ones.' }
        ]
    },
];

export const MOCK_CHATS: Chat[] = [
    {
        id: 1,
        companionId: 2, // Ben
        messages: [
            { sender: 'me', text: 'Hey Ben! Your trekking pictures from Peru look amazing. I\'m also a huge fan of adventure travel.', timestamp: 'Yesterday' },
            { sender: 'them', text: 'Thanks! Peru was incredible. If you love adventure, you should definitely check out the Ausangate Trek.', timestamp: '10:45 AM' }
        ]
    },
    {
        id: 2,
        companionId: 3, // Chloe
        messages: [
            { sender: 'me', text: 'Hi Chloe, saw you\'re into cultural trips. Any recommendations for Japan?', timestamp: '3 days ago' },
            { sender: 'them', text: 'Absolutely! You can\'t miss Kyoto for the temples and Gion district. And the food in Osaka is a must-try.', timestamp: '2 days ago' }
        ]
    }
];

export const MOCK_ICEBREAKER_REQUESTS: IcebreakerRequest[] = [
    {
        id: 1,
        sender: MOCK_COMPANIONS.find(c => c.id === 4)!, // Mark
        message: "Hey! Saw we both love beach parties. We should totally plan a trip to Goa or Ibiza sometime.",
        timestamp: "2h ago",
    },
    {
        id: 2,
        sender: MOCK_COMPANIONS.find(c => c.id === 5)!, // Liam
        message: "Your hiking photos are epic. I'm planning a trip to the Andes next year, any tips?",
        timestamp: "8h ago",
    }
];


export const TRAVEL_PREFERENCES_QUESTIONS = {
    budget: ['Low', 'Medium', 'High'],
    travelType: ['Solo', 'Group', 'Couple'],
    groupSize: ['2-4', '5-10', '10+'],
    duration: ['Weekend', '1-2 Weeks', '2+ Weeks'],
    activityLevel: ['Relaxed', 'Moderate', 'High'],
    climate: ['Hot', 'Cold', 'Moderate'],
};