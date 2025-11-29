import React, { useState, useRef, useEffect } from 'react';
import { analyzeTravelRequest, getAIBotResponse } from '../services/geminiService';
import { PaperAirplaneIcon, PlaneIcon, TrainIcon, BusIcon, TaxiIcon, WalkIcon } from '../components/icons/Icons';
import type { TravelPlanRequest, StructuredBotResponse, BotQuestion, TransportOption, Recommendation, ItineraryItem } from '../types';
import { useUser } from '../contexts/UserContext';

// --- UI Components for Structured Response ---

const SectionSeparator: React.FC = () => (
    <div className="flex justify-center items-center my-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
        </svg>
    </div>
);

const TransportCard: React.FC<{ transport: TransportOption, title: string }> = ({ transport, title }) => {
    const Icon = {
        Flight: PlaneIcon,
        Train: TrainIcon,
        Bus: BusIcon,
        Taxi: TaxiIcon,
        Walk: WalkIcon,
    }[transport.type];
    return (
        <div className="bg-sky-blue/10 rounded-2xl p-3 my-2">
            <h4 className="font-bold text-sm text-sky-blue">{title}</h4>
            <div className="flex items-center space-x-3 mt-2">
                <Icon className="w-8 h-8 text-sky-blue" />
                <div>
                    <p className="font-semibold text-charcoal-gray">{transport.name}</p>
                    <p className="text-xs text-gray-600">{transport.departureTime} → {transport.arrivalTime}</p>
                </div>
            </div>
        </div>
    );
};

const RecommendationCard: React.FC<{ item: Recommendation, title: string }> = ({ item, title }) => (
    <div className="bg-sunset-orange/10 rounded-2xl overflow-hidden my-2">
        <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" />
        <div className="p-3">
            <h4 className="font-bold text-sm text-sunset-orange">{title}</h4>
            <p className="font-semibold text-charcoal-gray mt-1">{item.name}</p>
            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
        </div>
    </div>
);

const ItineraryDay: React.FC<{ day: number, activities: ItineraryItem[] }> = ({ day, activities }) => (
    <div className="mt-3">
        <h3 className="text-xl font-poppins font-bold text-charcoal-gray">Day {day}</h3>
        <div className="mt-2 space-y-2 border-l-2 border-sunset-orange pl-5">
            {activities.map((activity, index) => (
                <div key={index} className="relative py-2">
                    <span className="absolute -left-[24px] top-3 h-4 w-4 bg-sunset-orange rounded-full border-4 border-white"></span>
                    <p className="font-bold text-sm text-gray-500">{activity.time}</p>
                    <RecommendationCard item={activity.place} title="Activity" />
                    {activity.transportToNext && <TransportCard transport={activity.transportToNext} title="Next up:" />}
                </div>
            ))}
        </div>
    </div>
);


// --- Main Chat Logic ---
interface Message {
  id: number;
  sender: 'user' | 'bot';
  text?: string;
  structuredContent?: StructuredBotResponse;
  question?: BotQuestion;
  options?: string[];
}

const BotChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: Date.now(), sender: 'bot', text: "Hello! I'm your TripMate AI. Where would you like to plan a trip to?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();
    
    const [planRequest, setPlanRequest] = useState<TravelPlanRequest>({});
    const [currentQuestion, setCurrentQuestion] = useState<BotQuestion>('destination');
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [messages]);

    const addMessage = (message: Omit<Message, 'id'>) => {
        setMessages(prev => [...prev, { ...message, id: Date.now() }]);
    };
    
    const askNextQuestion = (plan: TravelPlanRequest) => {
        if (!plan.destination) { setCurrentQuestion('destination'); addMessage({ sender: 'bot', question: 'destination', text: "Great! Where are you planning to go?"}); return; }
        if (!plan.startPoint) { setCurrentQuestion('startPoint'); addMessage({ sender: 'bot', question: 'startPoint', text: `Awesome, ${plan.destination}! Where will you be travelling from?`}); return; }
        if (!plan.durationInDays) { setCurrentQuestion('durationInDays'); addMessage({ sender: 'bot', question: 'durationInDays', text: "How many days will your trip be? (e.g., '3', '5', '7')", options: ['3 days', '5 days', '7 days']}); return; }
        if (!plan.travelStyle) { setCurrentQuestion('travelStyle'); addMessage({ sender: 'bot', question: 'travelStyle', text: "What's the travel style?", options: ['Solo', 'Couple', 'Group', 'Family']}); return; }
        if (!plan.budget) { setCurrentQuestion('budget'); addMessage({ sender: 'bot', question: 'budget', text: "What's your approximate budget?", options: ['Budget-friendly', 'Mid-range', 'Luxury']}); return; }
        if (!plan.transportMode) { setCurrentQuestion('transportMode'); addMessage({ sender: 'bot', question: 'transportMode', text: "What's your preferred mode of transportation to get there?", options: ['Flight', 'Train', 'Bus']}); return; }
        
        setCurrentQuestion(null);
        generateFinalPlan(plan);
    };

    const generateFinalPlan = async (finalPlan: TravelPlanRequest) => {
        setIsLoading(true);
        addMessage({ sender: 'bot', text: "Perfect! I have all the details. Let me craft the perfect itinerary for you..."});
        try {
            const finalPlanWithUser = { ...finalPlan, userName: user.name };
            const botResponse = await getAIBotResponse(finalPlanWithUser);
            addMessage({ sender: 'bot', structuredContent: botResponse });
        } catch (error) {
            addMessage({ sender: 'bot', text: "Sorry, I had trouble creating your plan. Please try again." });
        } finally {
            setIsLoading(false);
            setPlanRequest({});
        }
    };
    
    const processUserInput = async (text: string) => {
        addMessage({ sender: 'user', text });
        setInput('');
        setIsLoading(true);
        
        let newPlan = { ...planRequest };

        if (messages.length === 1) {
            const analysis = await analyzeTravelRequest(text);
            newPlan = { ...newPlan, ...analysis };
            setPlanRequest(newPlan);
            setIsLoading(false);
            askNextQuestion(newPlan);
            return;
        }

        const question = currentQuestion;
        if (question && question !== 'interests') {
             if (question === 'durationInDays') {
                const num = parseInt(text.replace(/\D/g, ''), 10);
                if (!isNaN(num)) newPlan.durationInDays = num;
            } else if (question === 'travelStyle') {
                newPlan.travelStyle = text as any;
            } else if (question === 'budget') {
                newPlan.budget = text as any;
            } else if (question === 'transportMode') {
                 newPlan.transportMode = text as any;
            } else if (question === 'startPoint' || question === 'destination') {
                newPlan[question] = text;
            }
        }
        
        setPlanRequest(newPlan);
        setIsLoading(false);
        askNextQuestion(newPlan);
    };

    const handleSend = () => {
        if (input.trim() === '' || isLoading) return;
        processUserInput(input);
    };

    const handleOptionClick = (option: string) => {
        if (isLoading) return;
        processUserInput(option);
    };

    const shouldDisableInput = messages[messages.length - 1]?.options?.length > 0 && currentQuestion !== 'durationInDays';

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-poppins font-bold text-center text-charcoal-gray">TripMate AI Bot</h1>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-3xl ${msg.sender === 'user' ? 'bg-sky-blue text-white rounded-br-none' : 'bg-gray-100 text-charcoal-gray rounded-bl-none'}`}>
                           {msg.text && <div className="px-4 py-3 whitespace-pre-wrap">{msg.text}</div>}
                           {msg.structuredContent && (
                               <div className="p-4">
                                   <p className="whitespace-pre-wrap font-semibold">{msg.structuredContent.introduction}</p>
                                   <SectionSeparator />
                                   <TransportCard transport={msg.structuredContent.initialTransport} title="Getting There" />
                                   <SectionSeparator />
                                   <RecommendationCard item={msg.structuredContent.hotelRecommendation} title="Where to Stay" />
                                   {msg.structuredContent.itinerary.map(day => <ItineraryDay key={day.day} {...day} />)}
                               </div>
                           )}
                        </div>
                        {msg.options && (
                            <div className="mt-2 flex flex-wrap gap-2 max-w-xs md:max-w-md lg:max-w-lg">
                                {msg.options.map(opt => (
                                    <button key={opt} onClick={() => handleOptionClick(opt)} className="bg-white border border-sky-blue text-sky-blue px-3 py-1.5 text-sm rounded-full hover:bg-sky-blue/10 transition-colors font-medium">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-charcoal-gray px-4 py-3 rounded-3xl rounded-bl-none">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isLoading ? "Thinking..." : (shouldDisableInput ? "Please select an option" : "Type your message...")}
                        className="w-full border-gray-300 border rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-blue bg-white text-charcoal-gray placeholder:text-gray-400"
                        disabled={isLoading || shouldDisableInput}
                    />
                    <button onClick={handleSend} disabled={isLoading || shouldDisableInput} className="bg-sunset-orange text-white rounded-full p-3.5 disabled:bg-opacity-50 transition-colors">
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BotChatPage;