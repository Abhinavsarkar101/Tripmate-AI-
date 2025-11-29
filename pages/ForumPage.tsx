import React, { useState } from 'react';
import { MOCK_FORUM_POSTS } from '../constants';
import type { ForumPost as ForumPostType, ForumReply } from '../types';
import { useUser } from '../contexts/UserContext';

const ForumPost: React.FC<{ post: ForumPostType, onReply: (postId: number, reply: ForumReply) => void }> = ({ post, onReply }) => {
  const [replyText, setReplyText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useUser();

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      const newReply: ForumReply = {
        id: Date.now(),
        username: user.name,
        userAvatar: user.profilePicture,
        reply: replyText,
      };
      onReply(post.id, newReply);
      setReplyText('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
      <div className="flex items-start space-x-4">
        <img src={post.userAvatar} alt={post.username} className="w-11 h-11 rounded-full" />
        <div>
          <p className="font-semibold text-charcoal-gray">{post.username}</p>
          <p className="mt-1 text-charcoal-gray">{post.question}</p>
        </div>
      </div>
      <div className="mt-4">
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-sky-blue hover:underline font-semibold">
          {isExpanded ? 'Hide Replies' : `View ${post.replies.length} Replies`}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-4 pl-8 border-l-2 border-gray-200 space-y-4">
          {post.replies.map(reply => (
            <div key={reply.id} className="flex items-start space-x-3">
              <img src={reply.userAvatar} alt={reply.username} className="w-9 h-9 rounded-full" />
              <div>
                <p className="font-semibold text-sm text-charcoal-gray">{reply.username} {reply.isAI && <span className="text-xs bg-sunset-orange text-white px-1.5 py-0.5 rounded-full ml-1 font-medium">AI</span>}</p>
                <p className="text-sm mt-1 text-gray-700">{reply.reply}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleReplySubmit} className="flex items-center space-x-2 pt-3">
            <img src={user.profilePicture} alt={user.name} className="w-9 h-9 rounded-full"/>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full border-gray-300 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue bg-white text-charcoal-gray placeholder:text-gray-400"
            />
            <button type="submit" className="bg-sunset-orange text-white rounded-full p-2.5 hover:bg-opacity-90 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086L2.279 16.76a.75.75 0 00.95.826l12.898-3.685a.75.75 0 000-1.425L3.105 2.289z" /></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};


const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPostType[]>(MOCK_FORUM_POSTS);
  
  const handleReply = (postId: number, reply: ForumReply) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, replies: [...post.replies, reply] } : post
      )
    );
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-poppins font-bold text-center text-charcoal-gray mb-6">Community Forum</h1>
      <div>
        {posts.map(post => (
          <ForumPost key={post.id} post={post} onReply={handleReply} />
        ))}
      </div>
    </div>
  );
};

export default ForumPage;