import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, MapPin, Wrench, BookOpen, Truck, ChefHat, Laptop, Users, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { auth, setToken, setStoredUser } from '@/lib/api';

const COMMUNITY_POSTS = [
  {
    id: 1,
    name: 'Sarah Chen',
    avatar: 'SC',
    avatarBg: 'bg-blue-100 text-blue-600',
    time: '2h ago',
    text: 'Just helped my neighbour fix their leaky tap! Felt amazing to give back 💧',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=220&fit=crop',
    likes: 24,
    location: 'Fitzroy',
  },
  {
    id: 2,
    name: 'Miguel R.',
    avatar: 'MR',
    avatarBg: 'bg-green-100 text-green-600',
    time: '5h ago',
    text: 'Teaching free guitar lessons every Saturday morning. All ages welcome 🎸',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=220&fit=crop',
    likes: 41,
    location: 'Richmond',
  },
  {
    id: 3,
    name: 'Emma J.',
    avatar: 'EJ',
    avatarBg: 'bg-pink-100 text-pink-600',
    time: '1d ago',
    text: 'Someone helped me move furniture today — so grateful for this community! 🙏',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=220&fit=crop',
    likes: 58,
    location: 'Collingwood',
  },
];

const CATEGORIES = [
  { icon: BookOpen, label: 'Teaching', color: 'bg-blue-50 text-blue-600' },
  { icon: Laptop, label: 'Tech Help', color: 'bg-purple-50 text-purple-600' },
  { icon: Wrench, label: 'Repairs', color: 'bg-green-50 text-green-600' },
  { icon: ChefHat, label: 'Cooking', color: 'bg-yellow-50 text-yellow-600' },
  { icon: Truck, label: 'Transport', color: 'bg-red-50 text-red-600' },
  { icon: Users, label: 'Caregiving', color: 'bg-pink-50 text-pink-600' },
];

const STATS = [
  { value: '2,400+', label: 'Helpers nearby' },
  { value: '8,100+', label: 'Acts of help' },
  { value: '4.9★', label: 'Avg rating' },
];

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex-shrink-0 w-80">
      <img src={post.image} alt="" className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2.5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${post.avatarBg}`}>
            {post.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-slate-800 truncate">{post.name}</p>
            <p className="text-xs text-slate-400 flex items-center gap-0.5 mt-0.5">
              <MapPin className="w-3 h-3" />{post.location} · {post.time}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{post.text}</p>
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-1 ${liked ? 'text-red-500' : 'text-slate-400'}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
          {post.likes + (liked ? 1 : 0)}
        </button>
      </div>
    </div>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await auth.login(email, password);
      navigate('/Home');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5faf7] flex flex-col">

      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between shadow-sm">
        <img
          src="https://media.base44.com/images/public/user_69af677dd021f351a8df1698/9f91fcffd_dogood.png"
          alt="DoGood"
          className="h-10 w-auto rounded-lg"
        />
        <button
          onClick={() => setShowLogin(true)}
          className="text-base font-bold text-dogood-green px-4 py-2 rounded-full border-2 border-dogood-green hover:bg-dogood-green hover:text-white transition-colors"
        >
          Log in
        </button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=420&fit=crop"
          alt="Community helping"
          className="w-full h-60 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold leading-tight mb-2"
          >
            Your neighbourhood,<br />helping each other.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-white/90"
          >
            Share skills. Volunteer. Get help when you need it.
          </motion.p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="flex justify-around">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-extrabold text-dogood-green">{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Community Feed Preview */}
      <div className="px-4 pt-6 pb-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-slate-800">Community in action</h2>
          <span className="text-sm text-dogood-green font-bold flex items-center gap-1">
            Live feed <span className="w-2 h-2 rounded-full bg-dogood-green animate-pulse inline-block ml-1" />
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {COMMUNITY_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-xl font-extrabold text-slate-800 mb-4">What can you offer or get?</h2>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map(({ icon: Icon, label, color }) => (
            <div key={label} className={`rounded-2xl flex flex-col items-center justify-center py-5 gap-2 ${color} bg-opacity-60`}>
              <Icon className="w-6 h-6" />
              <span className="text-sm font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 pt-5 pb-4">
        <h2 className="text-xl font-extrabold text-slate-800 mb-4">How DoGood works</h2>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Create your profile', desc: 'Tell the community what skills you have or what you need help with.' },
            { step: '2', title: 'Browse or post', desc: 'Find helpers nearby or post a request — it only takes a minute.' },
            { step: '3', title: 'Connect & help', desc: 'Chat, agree on a time, and help each other. It\'s that simple.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-dogood-green flex items-center justify-center text-white font-extrabold text-base flex-shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-base font-bold text-slate-800">{item.title}</p>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="mx-4 mb-6 bg-gradient-to-r from-dogood-green to-dogood-teal rounded-2xl p-5 text-white">
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-white text-white" />)}
        </div>
        <p className="text-base font-semibold leading-relaxed mb-4">
          "I needed help with my resume and within 2 hours someone from my suburb offered to help for free. This community is amazing!"
        </p>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">LW</div>
          <span className="text-sm font-semibold text-white/90">Lisa Wang · St Kilda</span>
        </div>
      </div>

      {/* Spacer for sticky CTA */}
      <div className="h-36" />

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-100 px-5 pt-4 pb-7 shadow-xl">
        <div className="flex gap-3 max-w-sm mx-auto">
          <Link to="/JoinDoGood" className="flex-1">
            <Button className="w-full h-14 rounded-full bg-dogood-green hover:bg-dogood-green/90 text-white font-bold text-base shadow-md">
              Volunteer / Offer Help
            </Button>
          </Link>
          <Link to="/JoinDoGood" className="flex-1">
            <Button variant="outline" className="w-full h-14 rounded-full border-2 border-dogood-green text-dogood-green font-bold text-base bg-white hover:bg-[#f0faf5]">
              Request Help
            </Button>
          </Link>
        </div>
        <p className="text-center text-sm text-slate-400 mt-3">
          Already have an account?{' '}
          <span
            onClick={() => setShowLogin(true)}
            className="text-dogood-green font-bold cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-t-3xl p-6 pb-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-slate-800">Welcome back</h2>
                <button onClick={() => setShowLogin(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="anonymous@dogood.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-12 rounded-xl text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      className="h-12 rounded-xl pr-10 text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
                )}

                <Button
                  onClick={handleLogin}
                  disabled={loading || !email || !password}
                  className="w-full h-12 rounded-full bg-dogood-green hover:bg-dogood-green/90 text-white font-bold text-base"
                >
                  {loading ? 'Signing in...' : 'Log in'}
                </Button>

                <p className="text-center text-sm text-slate-400">
                  Don't have an account?{' '}
                  <Link to="/JoinDoGood" className="text-dogood-green font-bold" onClick={() => setShowLogin(false)}>
                    Join DoGood
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}