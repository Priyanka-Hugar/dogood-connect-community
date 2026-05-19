import React, { useState, useRef } from 'react';
import { Camera, Heart, MessageCircle, X, Upload } from 'lucide-react';
import { gallery, auth } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: dbPosts = [] } = useQuery({
    queryKey: ['galleryPosts'],
    queryFn: () => gallery.list(),
  });

  const posts = [...dbPosts, ...DEMO_POSTS];

  const getInitials = (name) =>
    (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const getColor = (name) => {
    const colors = ['bg-dogood-green', 'bg-dogood-teal', 'bg-dogood-blue', 'bg-dogood-orange'];
    const idx = (name || '').charCodeAt(0) % colors.length;
    return colors[idx];
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const compressAndEncode = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = reject;
    img.src = url;
  });

  const handleUpload = async () => {
    if (!selectedFile || !caption.trim()) {
      toast.error('Please select an image and add a caption.');
      return;
    }
    setUploading(true);
    try {
      const user = await auth.me();
      const imageData = await compressAndEncode(selectedFile);
      await gallery.create({
        image_url: imageData,
        caption,
        user_name: user?.full_name || user?.name || 'Anonymous',
        likes: 0,
        comments_count: 0,
      });
      queryClient.invalidateQueries({ queryKey: ['galleryPosts'] });
      toast.success('Photo shared to the community!');
      setShowUpload(false);
      setCaption('');
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (e) {
      toast.error('Upload failed: ' + e.message);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-dogood-teal to-dogood-green px-4 pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Community Gallery</h1>
          <p className="text-white/80 text-xs mt-0.5">Share moments of helping and kindness</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-t-3xl p-6 pb-24 overflow-y-auto"
              style={{ maxHeight: '90vh' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold">Share a Moment</h2>
                <button onClick={() => setShowUpload(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

              {previewUrl ? (
                <div className="relative mb-4">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    onClick={() => { setSelectedFile(null); setPreviewUrl(''); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 mb-4 text-muted-foreground"
                >
                  <Upload className="w-8 h-8" />
                  <p className="text-sm font-semibold">Tap to select a photo</p>
                </button>
              )}

              <Input
                placeholder="Write a caption..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="mb-4 h-11 rounded-xl"
              />

              <Button
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !caption.trim()}
                className="w-full h-11 rounded-full bg-dogood-green hover:bg-dogood-green/90 text-white font-bold"
              >
                {uploading ? 'Uploading...' : 'Share to Community'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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