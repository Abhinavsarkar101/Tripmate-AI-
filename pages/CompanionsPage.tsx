import React, { useState, useMemo, useRef } from 'react';
import { MOCK_COMPANIONS, TRAVEL_PREFERENCES_QUESTIONS } from '../constants';
import type { TravelPreferences, Companion } from '../types';
import { useUser } from '../contexts/UserContext';
import { XMarkIcon, HeartIcon, ChatBubbleOvalLeftEllipsisIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons/Icons';

// --- SUB-COMPONENTS ---

const Questionnaire: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const { user, updateUser } = useUser();
    const [preferences, setPreferences] = useState<TravelPreferences>(user.preferences);

    const handleChange = <T extends keyof TravelPreferences,>(
        field: T,
        value: TravelPreferences[T]
    ) => {
        setPreferences(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(user, preferences);
        onSubmit();
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-3xl shadow-lg">
                <h2 className="text-2xl font-poppins font-semibold text-center text-charcoal-gray">Find Your Perfect Travel Mate!</h2>
                <p className="text-center text-gray-600">Fill out your preferences to get matched.</p>
                {Object.entries(TRAVEL_PREFERENCES_QUESTIONS).map(([key, options]) => (
                    <div key={key}>
                        <label className="block text-md font-semibold capitalize text-charcoal-gray mb-2">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <div className="flex flex-wrap gap-2">
                            {options.map(option => (
                                <button
                                    type="button"
                                    key={option}
                                    onClick={() => handleChange(key as keyof TravelPreferences, option as any)}
                                    className={`px-4 py-2 text-sm rounded-full transition-colors font-medium ${preferences[key as keyof TravelPreferences] === option ? 'bg-sunset-orange text-white' : 'bg-gray-200 text-charcoal-gray hover:bg-gray-300'}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="submit" className="w-full bg-sunset-orange text-white py-3 rounded-2xl font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
                    Find Matches
                </button>
            </form>
        </div>
    );
};

const CompanionDetailModal: React.FC<{ companion: Companion; onClose: () => void }> = ({ companion, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => setCurrentImageIndex(i => (i + 1) % companion.gallery.length);
    const prevImage = () => setCurrentImageIndex(i => (i - 1 + companion.gallery.length) % companion.gallery.length);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 font-inter" onClick={onClose}>
            <div className="bg-white rounded-3xl overflow-hidden w-[90vw] max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="relative h-72">
                    <img src={companion.gallery[currentImageIndex]} alt={companion.name} className="w-full h-full object-cover" />
                    {companion.gallery.length > 1 && (
                        <>
                            <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/60 rounded-full p-1 text-charcoal-gray backdrop-blur-sm"><ChevronLeftIcon className="w-6 h-6"/></button>
                            <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/60 rounded-full p-1 text-charcoal-gray backdrop-blur-sm"><ChevronRightIcon className="w-6 h-6"/></button>
                        </>
                    )}
                </div>
                <div className="p-5 space-y-4">
                    <h2 className="text-3xl font-poppins font-bold">{companion.name}, {companion.age}</h2>
                    <div>
                        <h3 className="font-semibold text-sunset-orange">Interests</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {companion.interests.map(interest => <span key={interest} className="bg-sky-blue/20 text-sky-blue text-xs font-semibold px-2.5 py-1 rounded-full">{interest}</span>)}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sunset-orange">Travel Style</h3>
                        <p>{companion.travelStyle}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-sunset-orange">Preferred Destinations</h3>
                        <p>{companion.preferredDestinations.join(', ')}</p>
                    </div>
                    <button onClick={onClose} className="w-full bg-charcoal-gray text-white py-2.5 mt-2 rounded-2xl font-semibold">Close</button>
                </div>
            </div>
        </div>
    );
};

const IcebreakerModal: React.FC<{ companion: Companion; onClose: () => void; onSend: (message: string) => void }> = ({ companion, onClose, onSend }) => {
    const [message, setMessage] = useState('');
    const MAX_WORDS = 50;
    const wordCount = message.trim().split(/\s+/).filter(Boolean).length;

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 font-inter" onClick={onClose}>
            <div className="bg-white rounded-3xl p-6 w-[90vw] max-w-sm" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-poppins font-bold text-center">Send an Icebreaker to {companion.name}</h2>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hey! I see we both love..."
                    className="w-full border-gray-300 border rounded-2xl p-3 mt-4 h-32 resize-none bg-white text-charcoal-gray placeholder:text-gray-400 focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                    maxLength={300}
                />
                <div className={`text-right text-sm mt-1 ${wordCount > MAX_WORDS ? 'text-red-500' : 'text-gray-500'}`}>{wordCount} / {MAX_WORDS} words</div>
                <button 
                    onClick={handleSend}
                    disabled={wordCount > MAX_WORDS || wordCount === 0}
                    className="w-full bg-sky-blue text-white py-2.5 mt-2 rounded-2xl font-semibold disabled:bg-opacity-50 transition-colors">
                    Send
                </button>
            </div>
        </div>
    );
};


const TinderUI: React.FC<{ onRetake: () => void }> = ({ onRetake }) => {
    const { addMatch } = useUser();
    const companions = useMemo(() => MOCK_COMPANIONS.sort(() => 0.5 - Math.random()), []);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const [showDetail, setShowDetail] = useState<Companion | null>(null);
    const [showIcebreaker, setShowIcebreaker] = useState<Companion | null>(null);

    const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const isClick = useRef(true);
    
    const currentCompanion = companions[currentIndex];

    const resetCardPosition = () => {
        const card = document.getElementById(`card-${currentCompanion?.id}`);
        if(card) card.style.transition = 'transform 0.4s ease-out';
        setCardPosition({ x: 0, y: 0 });
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!currentCompanion) return;
        isClick.current = true;
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
        const card = document.getElementById(`card-${currentCompanion.id}`);
        if(card) card.style.transition = 'none';
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !currentCompanion) return;
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            isClick.current = false;
        }
        setCardPosition({ x: deltaX, y: deltaY });
    };
    
    const handlePointerUp = () => {
        if (!isDragging) return;
        setIsDragging(false);

        if (isClick.current && currentCompanion) {
            setShowDetail(currentCompanion);
            resetCardPosition();
            return;
        }

        const SWIPE_THRESHOLD_X = 100;
        const SWIPE_THRESHOLD_Y = -120;

        if (cardPosition.x > SWIPE_THRESHOLD_X) {
            triggerSwipe('right');
        } else if (cardPosition.x < -SWIPE_THRESHOLD_X) {
            triggerSwipe('left');
        } else if (cardPosition.y < SWIPE_THRESHOLD_Y) {
            triggerSwipe('up');
        } else {
            resetCardPosition();
        }
    };
    
    const triggerSwipe = (direction: 'left' | 'right' | 'up') => {
        if (!currentCompanion) return;
        
        const card = document.getElementById(`card-${currentCompanion.id}`);
        if(card) card.style.transition = 'transform 0.5s ease-in';
        
        if (direction === 'right') {
            setCardPosition({ x: 500, y: 0 });
            addMatch(currentCompanion);
        } else if (direction === 'left') {
            setCardPosition({ x: -500, y: 0 });
        } else if (direction === 'up') {
            setShowIcebreaker(currentCompanion);
            resetCardPosition();
            return;
        }

        setTimeout(() => {
            setCurrentIndex(i => i + 1);
            setCardPosition({ x: 0, y: 0 });
            const nextCard = document.getElementById(`card-${companions[currentIndex+1]?.id}`);
            if(nextCard) nextCard.style.transition = 'none';
        }, 500);
    };

    const handleSendIcebreaker = (message: string) => {
        console.log(`Sending to ${showIcebreaker?.name}: "${message}"`);
        if (showIcebreaker) {
            addMatch(showIcebreaker);
        }
        setShowIcebreaker(null);

        setTimeout(() => {
            setCurrentIndex(i => i + 1);
            setCardPosition({ x: 0, y: 0 });
        }, 300);
    };
    
    const rotation = cardPosition.x / 20;
    const opacity = Math.min(Math.abs(cardPosition.x) / 100, 1);
    const upOpacity = Math.min(Math.abs(cardPosition.y) / 150, 1);
    
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {showDetail && <CompanionDetailModal companion={showDetail} onClose={() => setShowDetail(null)} />}
            {showIcebreaker && <IcebreakerModal companion={showIcebreaker} onClose={() => setShowIcebreaker(null)} onSend={handleSendIcebreaker} />}

            <div className="flex justify-between items-center mb-4 px-2">
                <h1 className="text-3xl font-poppins font-bold text-charcoal-gray">Find Your Mate</h1>
                <button onClick={onRetake} className="text-sm text-sunset-orange hover:underline font-semibold">Retake Quiz</button>
            </div>
            
            <div className="relative flex-grow flex items-center justify-center -mt-8">
                {currentIndex >= companions.length ? (
                    <div className="text-center p-4">
                        <p className="text-2xl font-poppins font-semibold text-charcoal-gray">That's everyone for now!</p>
                        <p className="text-gray-600 mt-2">Check back later for new travel companions.</p>
                    </div>
                ) : (
                    companions.map((companion, index) => {
                        if (index < currentIndex) return null;
                        const isTop = index === currentIndex;

                        const style = isTop ? {
                                transform: `translate(${cardPosition.x}px, ${cardPosition.y}px) rotate(${rotation}deg) scale(1)`,
                                zIndex: companions.length - index,
                                touchAction: 'none' as 'none',
                            } : {
                                transform: `translateY(${(index - currentIndex) * 8}px) scale(${1 - (index - currentIndex) * 0.05})`,
                                zIndex: companions.length - index,
                                opacity: index < currentIndex + 3 ? 1 : 0,
                            };
                        
                        return (
                            <div
                                id={`card-${companion.id}`}
                                key={companion.id}
                                className="absolute w-full h-[480px] rounded-3xl bg-gray-200 shadow-xl cursor-pointer"
                                style={style}
                                onPointerDown={isTop ? handlePointerDown : undefined}
                                onPointerMove={isTop ? handlePointerMove : undefined}
                                onPointerUp={isTop ? handlePointerUp : undefined}
                                onPointerLeave={isTop ? handlePointerUp : undefined}
                            >
                                <img src={companion.profilePicture} alt={companion.name} className="w-full h-full object-cover rounded-3xl"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-3xl"/>
                                
                                {isTop && (
                                    <>
                                        <div style={{opacity}} className={`absolute top-1/2 left-8 transition-opacity`}>
                                            <p className="text-4xl font-bold text-olive-green border-4 border-olive-green px-4 py-2 rounded-lg -rotate-12">CONNECT</p>
                                        </div>
                                        <div style={{opacity}} className={`absolute top-1/2 right-8 transition-opacity`}>
                                            <p className="text-4xl font-bold text-sunset-orange border-4 border-sunset-orange px-4 py-2 rounded-lg rotate-12">SKIP</p>
                                        </div>
                                        <div style={{opacity: upOpacity}} className={`absolute bottom-24 left-1/2 -translate-x-1/2 transition-opacity`}>
                                            <p className="text-3xl font-bold text-sky-blue border-4 border-sky-blue px-4 py-2 rounded-lg">ICEBREAKER</p>
                                        </div>
                                    </>
                                )}
                                
                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h3 className="text-3xl font-poppins font-bold">{companion.name}, {companion.age}</h3>
                                            <p className="text-sm opacity-90">{companion.travelStyle} Traveler</p>
                                        </div>
                                        <div className="text-center bg-black/30 backdrop-blur-sm p-2 rounded-xl">
                                            <p className="text-xl font-bold text-olive-green">{companion.similarityScore}%</p>
                                            <p className="text-xs opacity-80">Match</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs opacity-80">
                                        Interests: {companion.interests.join(', ')}
                                    </div>
                                </div>
                            </div>
                        );
                    }).reverse()
                )}
            </div>

            <div className="flex justify-center items-center space-x-6 py-6 z-10">
                <button onClick={() => triggerSwipe('left')} className="bg-white rounded-full p-4 shadow-2xl text-sunset-orange hover:scale-110 transition-transform">
                    <XMarkIcon className="w-8 h-8" />
                </button>
                 <button onClick={() => triggerSwipe('up')} className="bg-white rounded-full p-3 shadow-2xl text-sky-blue hover:scale-110 transition-transform">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />
                </button>
                <button onClick={() => triggerSwipe('right')} className="bg-white rounded-full p-5 shadow-2xl text-olive-green hover:scale-110 transition-transform">
                    <HeartIcon className="w-10 h-10" />
                </button>
            </div>
        </div>
    );
};


const CompanionsPage: React.FC = () => {
    const [showResults, setShowResults] = useState(false);

    return (
        <div className="max-w-sm mx-auto h-[calc(100vh-5rem)]">
            {!showResults ? (
                <Questionnaire onSubmit={() => setShowResults(true)} />
            ) : (
                <TinderUI onRetake={() => setShowResults(false)} />
            )}
        </div>
    );
};

export default CompanionsPage;