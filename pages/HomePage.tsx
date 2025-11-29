import React, { useState, useEffect } from 'react';
import { MOCK_SOCIAL_POSTS, MOCK_CHATS, MOCK_COMPANIONS, MOCK_ICEBREAKER_REQUESTS } from '../constants';
import type { SocialPost as SocialPostType, Chat as ChatType, Comment, IcebreakerRequest } from '../types';
import { useUser } from '../contexts/UserContext';
import { 
    PaperAirplaneIcon, 
    XMarkIcon, 
    HeartIcon, 
    ChatBubbleOvalLeftIcon, 
    BookmarkIcon, 
    HeartIconSolid, 
    BookmarkSolidIcon,
    TargetIcon,
    TargetSolidIcon
} from '../components/icons/Icons';

// --- Comment Modal and Nested Comment Components ---
const CommentThread: React.FC<{ comment: Comment }> = ({ comment }) => (
    <div className="flex items-start space-x-3">
        <img src={comment.userAvatar} alt={comment.username} className="w-9 h-9 rounded-full" />
        <div className="flex-1">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <p className="font-semibold text-sm text-charcoal-gray">{comment.username}</p>
                <p className="text-sm text-charcoal-gray">{comment.text}</p>
            </div>
            <div className="text-xs text-gray-500 mt-1 pl-2 space-x-3">
                <span>{comment.timestamp}</span>
                <button className="font-semibold hover:underline">Reply</button>
            </div>
            {comment.replies && (
                <div className="mt-3 space-y-3">
                    {comment.replies.map(reply => <CommentThread key={reply.id} comment={reply} />)}
                </div>
            )}
        </div>
    </div>
);

const CommentsModal: React.FC<{ post: SocialPostType; onClose: () => void }> = ({ post, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-off-white rounded-t-2xl md:rounded-2xl w-full max-w-lg h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 text-center relative">
                    <h2 className="font-poppins font-semibold text-lg">Comments</h2>
                    <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-500 hover:text-charcoal-gray"><XMarkIcon className="w-6 h-6"/></button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {post.commentData.map(comment => <CommentThread key={comment.id} comment={comment} />)}
                </div>
                <div className="p-3 border-t border-gray-200 bg-white">
                    <input type="text" placeholder="Add a comment..." className="w-full bg-gray-100 border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue" />
                </div>
            </div>
        </div>
    );
};


// --- Main Social Post Component ---
const SocialPost: React.FC<{ post: SocialPostType, onCommentClick: () => void }> = ({ post, onCommentClick }) => {
    const { bucketList, toggleBucketListItem } = useUser();

    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
    const [isInBucketList, setIsInBucketList] = useState(bucketList.includes(post.destinationTag));
    const [currentLikes, setCurrentLikes] = useState(post.likes);
    const [showLikeAnimation, setShowLikeAnimation] = useState(false);

    useEffect(() => {
      setIsInBucketList(bucketList.includes(post.destinationTag));
    }, [bucketList, post.destinationTag]);

    const handleLikeToggle = () => {
        setIsLiked(!isLiked);
        setCurrentLikes(prev => isLiked ? prev - 1 : prev + 1);
    };
    
    const handleDoubleClickLike = () => {
        if (!isLiked) {
            handleLikeToggle();
        }
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 800);
    };

    const handleBookmarkToggle = () => setIsBookmarked(!isBookmarked);
    const handleBucketListToggle = () => toggleBucketListItem(post.destinationTag);

    return (
        <div className="bg-white rounded-2xl shadow-lg mb-6 border border-gray-100">
            <div className="p-4 flex items-center">
                <img src={post.userAvatar} alt={post.username} className="w-10 h-10 rounded-full mr-3" />
                <div>
                    <p className="font-semibold text-sm">{post.username}</p>
                    <p className="text-xs text-gray-500">{post.destinationTag}</p>
                </div>
            </div>
            
            <div className="relative" onDoubleClick={handleDoubleClickLike}>
                <img src={post.imageUrl} alt={post.caption} className="w-full h-auto" />
                {showLikeAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <HeartIconSolid className="w-24 h-24 text-white/90 drop-shadow-lg animate-ping" style={{animationDuration: '0.8s'}} />
                    </div>
                )}
            </div>
            
            <div className="p-4 flex justify-between items-center">
                <div className="flex space-x-4 items-center">
                    <button onClick={handleLikeToggle} className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                        {isLiked ? <HeartIconSolid className="w-7 h-7 text-sunset-orange" /> : <HeartIcon className="w-7 h-7 text-charcoal-gray" />}
                    </button>
                    <button onClick={onCommentClick} className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                        <ChatBubbleOvalLeftIcon className="w-7 h-7 text-charcoal-gray" />
                    </button>
                    <button className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                        <PaperAirplaneIcon className="w-7 h-7 text-charcoal-gray" />
                    </button>
                    <button onClick={handleBucketListToggle} className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                        {isInBucketList ? <TargetSolidIcon className="w-7 h-7 text-sky-blue" /> : <TargetIcon className="w-7 h-7 text-charcoal-gray" />}
                    </button>
                </div>
                <button onClick={handleBookmarkToggle} className="transform transition-transform duration-150 ease-in-out hover:scale-110">
                    {isBookmarked ? <BookmarkSolidIcon className="w-7 h-7 text-charcoal-gray" /> : <BookmarkIcon className="w-7 h-7 text-charcoal-gray" />}
                </button>
            </div>

            <div className="px-4 pb-1">
                <p className="font-semibold text-sm">{currentLikes.toLocaleString()} likes</p>
            </div>

            <div className="px-4 pb-2">
                <p className="text-sm">
                    <span className="font-semibold mr-1.5">{post.username}</span> 
                    {post.caption}
                </p>
            </div>
            
            <div className="px-4 pb-4">
                <p onClick={onCommentClick} className="text-sm text-gray-500 cursor-pointer hover:underline">
                    View all {post.commentsCount} comments
                </p>
            </div>
        </div>
    );
};

const FeedView: React.FC = () => {
    const [activePostForComments, setActivePostForComments] = useState<SocialPostType | null>(null);

    return (
        <div>
            {MOCK_SOCIAL_POSTS.map(post => (
                <SocialPost key={post.id} post={post} onCommentClick={() => setActivePostForComments(post)} />
            ))}
            {activePostForComments && <CommentsModal post={activePostForComments} onClose={() => setActivePostForComments(null)} />}
        </div>
    );
};

const ChatListView: React.FC = () => {
    const { matches } = useUser();
    const [chats] = useState<ChatType[]>(MOCK_CHATS);
    const [icebreakers] = useState<IcebreakerRequest[]>(MOCK_ICEBREAKER_REQUESTS);

    const getCompanionById = (id: number) => {
        return MOCK_COMPANIONS.find(c => c.id === id);
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* New Matches Section */}
            <div>
                <h2 className="text-md font-semibold text-gray-500 px-1 mb-2">New Matches</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                    {matches.length > 0 ? (
                        matches.map(match => (
                            <div key={match.id} className="flex-shrink-0 text-center w-20">
                                <img src={match.profilePicture} alt={match.name} className="w-16 h-16 rounded-full object-cover border-2 border-sunset-orange mx-auto"/>
                                <p className="text-xs mt-1 truncate">{match.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 pl-2">Like someone to see them here!</p>
                    )}
                </div>
            </div>
            
            {/* Icebreaker Requests Section */}
            {icebreakers.length > 0 && (
                 <div className="border-t border-gray-200 pt-4">
                    <h2 className="text-md font-semibold text-gray-500 px-1 mb-3">Icebreaker Requests</h2>
                    <div className="space-y-2">
                        {icebreakers.map(req => (
                            <div key={req.id} className="flex items-start space-x-3 p-2 hover:bg-gray-100 rounded-2xl cursor-pointer">
                                <img src={req.sender.profilePicture} alt={req.sender.name} className="w-14 h-14 rounded-full object-cover"/>
                                <div className="flex-grow">
                                     <div className="flex justify-between items-center">
                                        <p className="font-bold">{req.sender.name}</p>
                                        <p className="text-xs text-gray-500">{req.timestamp}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 italic">"{req.message}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages Section */}
            <div className="border-t border-gray-200 pt-4 flex-grow">
                 <h2 className="text-md font-semibold text-gray-500 px-1 mb-3">Messages</h2>
                 <div className="space-y-2">
                    {chats.map(chat => {
                        const companion = getCompanionById(chat.companionId);
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        if (!companion) return null;
                        
                        return (
                            <div key={chat.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-2xl cursor-pointer">
                                <img src={companion.profilePicture} alt={companion.name} className="w-14 h-14 rounded-full object-cover"/>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold">{companion.name}</p>
                                        <p className="text-xs text-gray-500">{lastMessage.timestamp}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{lastMessage.sender === 'me' ? 'You: ' : ''}{lastMessage.text}</p>
                                </div>
                            </div>
                        )
                    })}
                 </div>
            </div>
        </div>
    );
};


const HomePage: React.FC = () => {
  const [view, setView] = useState<'feed' | 'chats'>('feed');

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-4 sticky top-0 bg-off-white/80 backdrop-blur-sm py-2 -mx-4 px-4 z-10">
        <h1 className="text-3xl font-poppins font-bold text-charcoal-gray tracking-tight">
          {view === 'feed' ? 'TripMate' : 'Chats'}
        </h1>
        <button onClick={() => setView(v => v === 'feed' ? 'chats' : 'feed')} className="p-1 text-charcoal-gray">
          {view === 'feed' ? (
            <PaperAirplaneIcon className="w-7 h-7 transform rotate-12" />
          ) : (
            <XMarkIcon className="w-7 h-7" />
          )}
        </button>
      </header>
      
      {view === 'feed' ? <FeedView /> : <ChatListView />}
    </div>
  );
};

export default HomePage;