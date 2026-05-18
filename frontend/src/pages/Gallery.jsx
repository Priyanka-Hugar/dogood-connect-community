import React from 'react';
import { Camera, Heart, MessageCircle } from 'lucide-react';
import { gallery } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const DEMO_POSTS = [
  {
    id: 'demo1',
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=350&fit=crop',
    user_name: 'Sarah Johnson',
    caption: 'Teaching kids how to code! Such a rewarding experience 💻',
    likes: 24,
    comments_count: 5,
    created_date: '2 hours ago',
  },
  {
    id: 'demo2',
    image_url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=250&fit=crop',
    user_name: 'Mike Chen',
    caption: 'Community garden project is blooming! 🌱',
    likes: 18,
    comments_count: 3,
    created_date: '5 hours ago',
  },
  {
    id: 'demo3',
    image_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=350&fit=crop',
    user_name: 'James Wilson',
    caption: 'Beach cleanup success! Removed 50kg of trash 🌊',
    likes: 56,
    comments_count: 12,
    created_date: '1 day ago',
  },
  {
    id: 'demo4',
    image_url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop',
    user_name: 'Anna Lee',
    caption: 'Volunteering at the local shelter today ❤️',
    likes: 42,
    comments_count: 8,
    created_date: '2 days ago',
  },
];

export default function Gallery() {
  const { data: dbPosts = [] } = useQuery({
    queryKey: ['galleryPosts'],
    queryFn: () => gallery.list(),
  });

  const posts = dbPosts.length > 0 ? dbPosts : DEMO_POSTS;

  const getInitials = (name) =>
    (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const getColor = (name) => {
    const colors = ['bg-dogood-green', 'bg-dogood-teal', 'bg-dogood-blue', 'bg-dogood-orange'];
    const idx = (name || '').charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-dogood-teal to-dogood-green px-4 pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Community Gallery</h1>
          <p className="text-white/80 text-xs mt-0.5">Share moments of helping and kindness</p>
        </div>
        <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Masonry Grid */}
      <div className="px-3 py-3 columns-2 gap-3 space-y-3">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm border border-border"
          >
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.caption}
                className="w-full object-cover"
                style={{ minHeight: idx % 2 === 0 ? '160px' : '120px' }}
              />
            )}
            <div className="p-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-7 h-7 rounded-full ${getColor(post.user_name)} text-white flex items-center justify-center text-[10px] font-bold`}>
                  {getInitials(post.user_name)}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{post.user_name}</p>
                  <p className="text-[10px] text-muted-foreground">{post.created_date}</p>
                </div>
              </div>
              <p className="text-xs text-foreground mb-2 leading-relaxed">{post.caption}</p>
              <div className="flex items-center gap-3 text-muted-foreground">
                <button className="flex items-center gap-1 text-xs">
                  <Heart className="w-3.5 h-3.5" /> {post.likes}
                </button>
                <button className="flex items-center gap-1 text-xs">
                  <MessageCircle className="w-3.5 h-3.5" /> {post.comments_count}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}