"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Plus, Camera, Smile, TrendingUp, Users, Coffee, Star } from 'lucide-react';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Separator } from '@/presentation/components/ui/separator';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import {
  villageWellPostsAtom,
  addVillageWellPostAtom,
  addVillageWellReactionAtom,
  addVillageWellCommentAtom,
  currentUserAtom,
  usersAtom,
} from '@/application/atoms/villageWellAtom';

const VillageWell: React.FC = () => {
  // State Management with Atoms
  const posts = useAtomValue(villageWellPostsAtom);
  const users = useAtomValue(usersAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const addPost = useSetAtom(addVillageWellPostAtom);
  const addReaction = useSetAtom(addVillageWellReactionAtom);
  const addComment = useSetAtom(addVillageWellCommentAtom);

  // Local State
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  // Categories for posts
  const categories = [
    { id: 'general', name: '🌸 General', description: 'Share anything on your mind' },
    { id: 'hobbies', name: '🎨 Hobbies', description: 'Your interests outside work' },
    { id: 'food', name: '🍱 Food & Recipes', description: 'Culinary adventures and recommendations' },
    { id: 'pets', name: '🐾 Pets & Animals', description: 'Our furry, feathered, and scaled friends' },
    { id: 'achievements', name: '⭐ Celebrations', description: 'Personal wins and milestones' },
    { id: 'questions', name: '🤔 Icebreakers', description: 'Fun questions to get to know each other' },
    { id: 'photos', name: '📸 Photo Sharing', description: 'Capture and share moments' },
  ];

  // Ice breaker prompts
  const iceBreakers = [
    "What's your go-to comfort food after a long day?",
    "If you could have dinner with any fictional character, who would it be?",
    "What's the most interesting place you've ever visited?",
    "What hobby would you pick up if you had unlimited time?",
    "What's your favorite way to unwind on weekends?",
    "If you could master any skill instantly, what would it be?",
  ];

  // Emojis for reactions
  const reactionEmojis = ['🌸', '❤️', '😊', '👏', '😍', '🤣', '🔥', '💯', '✨', '🎉'];

  // Handle creating a new post
  const handleCreatePost = () => {
    if (newPostContent.trim() && currentUser) {
      addPost({
        userId: currentUser.id,
        userName: currentUser.name,
        content: newPostContent,
        category: selectedCategory,
        reactions: [],
        comments: [],
      });
      setNewPostContent('');
      setShowCreatePost(false);
    }
  };

  // Handle adding a reaction
  const handleAddReaction = (postId: string, emoji: string) => {
    if (currentUser) {
      addReaction({ postId, emoji, userId: currentUser.id });
    }
  };

  // Handle adding a comment
  const handleAddComment = (postId: string) => {
    const commentContent = commentInputs[postId];
    if (commentContent?.trim() && currentUser) {
      addComment({
        postId,
        userId: currentUser.id,
        userName: currentUser.name,
        content: commentContent,
      });
      setCommentInputs({ ...commentInputs, [postId]: '' });
    }
  };

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  // Format time ago
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="h-full w-full flex bg-gradient-to-br from-emerald-50 to-amber-50 rounded-lg overflow-hidden shadow-2xl border-4 border-amber-200">
      {/* Sidebar - Categories and Quick Actions */}
      <div className="w-80 min-w-[20rem] max-w-[20rem] bg-gradient-to-b from-emerald-100 to-green-200 border-r-4 border-amber-200 shrink-0">
        {/* Header */}
        <div className="h-20 p-4 bg-gradient-to-r from-amber-100 to-yellow-100 border-b-2 border-amber-200 shrink-0">
          <h1 className="text-lg font-bold text-emerald-800 flex items-center gap-2 leading-tight">
            🏛️ The Village Well
          </h1>
          <p className="text-xs text-emerald-600 italic leading-tight">Where stories flow and friendships grow</p>
        </div>

        <div className="h-[calc(100%-5rem)] flex flex-col">
          {/* Create Post Button */}
          <div className="p-4 shrink-0">
            <Button
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white shadow-lg border-2 border-emerald-300 rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Share Something
            </Button>
          </div>

          {/* Categories */}
          <div className="flex-1 px-4 pb-4 min-h-0">
            <h3 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
              🎋 Categories
            </h3>
            <div className="space-y-2 h-full overflow-auto">
              {categories.map(category => (
                <div
                  key={category.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-150 ${
                    selectedCategory === category.id
                      ? 'bg-amber-200 shadow-sm'
                      : 'hover:bg-amber-100'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-emerald-800">{category.name}</span>
                  </div>
                  <p className="text-xs text-emerald-600">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ice Breaker Prompt */}
          <div className="p-4 border-t-2 border-amber-200 shrink-0">
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-3 rounded-lg border border-amber-200">
              <h4 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                💭 Ice Breaker
              </h4>
              <p className="text-xs text-emerald-600 italic">
                {iceBreakers[Math.floor(Math.random() * iceBreakers.length)]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-4 border-b-2 border-amber-200 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                {getCategoryInfo(selectedCategory).name}
              </h2>
              <p className="text-sm text-emerald-600 italic">
                {getCategoryInfo(selectedCategory).description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <Users className="h-4 w-4" />
              <span>{users.length} villagers</span>
            </div>
          </div>
        </div>

        {/* Create Post Form */}
        {showCreatePost && (
          <div className="bg-white/80 backdrop-blur-sm border-b-2 border-amber-200 p-4 shrink-0">
            <div className="space-y-3">
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind? Share a story, ask a question, or just say hello..."
                className="border-2 border-amber-200 bg-white/90 focus:border-emerald-300 focus:ring-emerald-200 text-emerald-900 placeholder:text-emerald-500 rounded-lg"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                    {getCategoryInfo(selectedCategory).name}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowCreatePost(false)}
                    className="text-emerald-600 hover:bg-amber-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {posts
                .filter(post => selectedCategory === 'general' || post.category === selectedCategory)
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map(post => (
                <Card key={post.id} className="bg-white/80 backdrop-blur-sm border-2 border-amber-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-sm font-bold text-purple-700 shadow-md">
                          {post.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-800">{post.userName}</h4>
                          <div className="flex items-center gap-2 text-xs text-emerald-600">
                            <span>{timeAgo(post.timestamp)}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryInfo(post.category).name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-emerald-900 mb-4 leading-relaxed">{post.content}</p>
                    
                    {/* Reactions */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {post.reactions.length > 0 && (
                          <div className="flex -space-x-1">
                            {Array.from(new Set(post.reactions.map(r => r.emoji))).slice(0, 3).map(emoji => (
                              <div key={emoji} className="bg-amber-100 rounded-full p-1 border border-white text-sm">
                                {emoji}
                              </div>
                            ))}
                          </div>
                        )}
                        {post.reactions.length > 0 && (
                          <span className="text-xs text-emerald-600 ml-2">
                            {post.reactions.reduce((total, reaction) => total + reaction.users.length, 0)}
                          </span>
                        )}
                      </div>
                      {post.comments.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.comments.length} comments</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-amber-200">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowEmojiPicker(showEmojiPicker === post.id ? null : post.id)}
                          className="text-emerald-600 hover:bg-amber-100 gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          React
                        </Button>
                        {showEmojiPicker === post.id && (
                          <div className="absolute top-full left-0 mt-2 bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-lg p-2 shadow-lg z-10">
                            <div className="grid grid-cols-5 gap-1">
                              {reactionEmojis.map(emoji => (
                                <button
                                  key={emoji}
                                  className="text-lg hover:scale-125 transition-transform duration-200 p-1 hover:bg-amber-100 rounded"
                                  onClick={() => {
                                    handleAddReaction(post.id, emoji);
                                    setShowEmojiPicker(null);
                                  }}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:bg-amber-100 gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Comment
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:bg-amber-100 gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {post.comments.map(comment => (
                          <div key={comment.id} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">
                              {comment.userName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="bg-amber-50 rounded-lg p-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-emerald-800">{comment.userName}</span>
                                  <span className="text-xs text-emerald-600">{timeAgo(comment.timestamp)}</span>
                                </div>
                                <p className="text-sm text-emerald-900">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">
                        {currentUser?.name.charAt(0)}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          placeholder="Write a comment..."
                          className="flex-1 border border-amber-200 bg-white/90 focus:border-emerald-300 focus:ring-emerald-200 text-emerald-900 placeholder:text-emerald-500 rounded-full"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        />
                        <Button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                          size="sm"
                          className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white rounded-full"
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default VillageWell;
