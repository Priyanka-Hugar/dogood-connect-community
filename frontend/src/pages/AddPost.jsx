import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Sparkles, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { skillPosts } from '@/lib/api';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import CategoryGrid from '@/components/addpost/CategoryGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const categoryColors = {
  teaching: 'bg-blue-100 text-blue-700',
  tech_support: 'bg-purple-100 text-purple-700',
  repair: 'bg-green-100 text-green-700',
  caregiving: 'bg-pink-100 text-pink-700',
  cooking: 'bg-yellow-100 text-yellow-700',
  transport: 'bg-red-100 text-red-700',
  creative: 'bg-indigo-100 text-indigo-700',
  physical_help: 'bg-orange-100 text-orange-700',
  professional: 'bg-gray-100 text-gray-700',
  other: 'bg-slate-100 text-slate-600',
};

const categoryLabels = {
  teaching: 'Teaching', tech_support: 'Tech', repair: 'Repair',
  caregiving: 'Caregiving', cooking: 'Cooking', transport: 'Transport',
  creative: 'Creative', physical_help: 'Physical', professional: 'Professional', other: 'Other',
};

function MatchResultCard({ post, onConnect }) {
  const initials = (post.user_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-dogood-blue flex items-center justify-center text-sm font-extrabold">
            {initials}
          </div>
          <div>
            <p className="font-bold text-sm">{post.user_name}</p>
            {post.location && <p className="text-xs text-muted-foreground">{post.location}</p>}
          </div>
        </div>
        {post.similarity !== undefined && (
          <div className="flex items-center gap-1 text-xs font-bold text-dogood-green">
            <Sparkles className="w-3 h-3" />
            {Math.round(post.similarity * 100)}% match
          </div>
        )}
      </div>
      <h3 className="font-extrabold text-sm text-foreground mt-2 mb-1">{post.title}</h3>
      {post.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{post.description}</p>}
      <div className="flex items-center justify-between">
        <Badge className={`${categoryColors[post.category] || categoryColors.other} border-0 text-xs rounded-full px-2.5`}>
          {categoryLabels[post.category] || post.category}
        </Badge>
        <Button
          size="sm"
          onClick={onConnect}
          className="rounded-xl bg-dogood-blue hover:bg-dogood-blue/90 text-white text-xs font-bold px-4 h-7"
        >
          Connect
        </Button>
      </div>
    </div>
  );
}

export default function AddPost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('offer');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [timePreference, setTimePreference] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState('my_location');

  // Match results screen state
  const [matchResults, setMatchResults] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // Fetch existing offers for AI matching
  const { data: allPosts = [] } = useQuery({
    queryKey: ['skillPosts'],
    queryFn: () => skillPosts.list(),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      try {
        return await skillPosts.create(data);
      } catch {
        // Fallback: store locally so the post still appears in the feed
        const local = { ...data, id: `local-${Date.now()}`, created_date: new Date().toISOString() };
        const existing = JSON.parse(localStorage.getItem('local_posts') || '[]');
        localStorage.setItem('local_posts', JSON.stringify([local, ...existing]));
        return local;
      }
    },
    onSuccess: async (savedPost) => {
      queryClient.invalidateQueries({ queryKey: ['skillPosts'] });
      toast.success('Posted successfully!');
      if (tab === 'offer') {
        navigate('/Home');
      } else {
        await runAiMatching(savedPost);
      }
    },
  });

  const runAiMatching = async (requestPost) => {
    setMatchLoading(true);
    const offers = allPosts.filter(p => p.type === 'offer');

    const DEMO_OFFERS = [
      { id: 'd1', user_name: 'Sarah Chen', location: '1.2 km (Fitzroy)', title: 'Web Development Help', description: 'I can help with React, HTML/CSS, and basic JavaScript projects', category: 'tech_support', availability: 'This weekend', user_rating: 4.9, type: 'offer', status: 'active' },
      { id: 'd2', user_name: 'Miguel Rodriguez', location: '2.8 km (Richmond)', title: 'Bike Repair & Maintenance', description: 'Professional mechanic offering bike tune-ups and repairs', category: 'repair', availability: 'Weekdays', user_rating: 5, type: 'offer', status: 'active' },
      { id: 'd3', user_name: 'Emma Johnson', location: '0.5 km (Fitzroy)', title: 'Guitar Lessons for Beginners', description: 'I can teach basic chords and music theory. All ages welcome!', category: 'teaching', availability: 'Weekends', user_rating: 4.7, type: 'offer', status: 'active' },
    ];
    const allOffers = [...offers, ...DEMO_OFFERS];

    if (allOffers.length === 0) {
      setMatchResults([]);
      setMatchLoading(false);
      return;
    }

    const query = `${requestPost.title}. ${requestPost.description || ''}`.trim();
    const sentences = allOffers.map(p => `${p.title}. ${p.description || ''}`);

    try {
      const { appParams } = await import('@/lib/app-params');
      const baseUrl = appParams.appBaseUrl || window.location.origin;
      const res = await fetch(`${baseUrl}/api/functions/matchSkills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, posts: allOffers }),
      });
      const text = await res.text();
      const result = text ? JSON.parse(text) : {};
      if (result?.ranked) {
        setMatchResults(result.ranked);
      } else {
        setMatchResults(allOffers);
      }
    } catch {
      setMatchResults(allOffers);
    }
    setMatchLoading(false);
  };

  const handleSubmit = () => {
    if (!category || !title) {
      toast.error('Please fill in at least the category and title.');
      return;
    }
    let userName = 'You';
    try {
      const stored = JSON.parse(localStorage.getItem('dogood_user'));
      if (stored?.full_name) userName = stored.full_name;
    } catch {}

    createMutation.mutate({
      type: tab === 'offer' ? 'offer' : 'request',
      category,
      title,
      description,
      availability: timePreference ? `${date} ${timePreference}` : date,
      location,
      location_type: locationType,
      status: 'active',
      user_name: userName,
    });
  };

  // --- Match Results Screen ---
  if (matchLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 rounded-full bg-dogood-green/10 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-dogood-green animate-pulse" />
        </div>
        <h2 className="text-xl font-extrabold text-foreground text-center">Finding the best matches for you...</h2>
        <p className="text-sm text-muted-foreground text-center">Our AI is scanning available offers in your community</p>
      </div>
    );
  }

  if (matchResults !== null) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => navigate('/Home')}>
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-foreground">Matching Offers</h1>
            <p className="text-xs text-muted-foreground">Based on your request</p>
          </div>
        </div>

        <div className="px-4 mb-4 py-3 bg-dogood-green/10 border-y border-dogood-green/20">
          <p className="text-xs text-muted-foreground">Your request:</p>
          <p className="font-bold text-sm text-foreground">{title}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>}
        </div>

        <div className="px-4 space-y-3 pb-8">
          {matchResults.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">No matching offers found yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Check back later as more people join!</p>
              <Button onClick={() => navigate('/Home')} className="mt-4 rounded-full bg-dogood-green text-white font-bold">
                Go to Home
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-dogood-green" />
                <p className="text-sm font-bold text-foreground">{matchResults.length} offers found for you</p>
              </div>
              <AnimatePresence>
                {matchResults.map((post, idx) => (
                  <motion.div
                    key={post.id || idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <MatchResultCard post={post} onConnect={() => navigate('/Messages')} />
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button
                onClick={() => navigate('/Home')}
                variant="outline"
                className="w-full rounded-full font-bold mt-2"
              >
                Back to Home
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- Form Screen ---
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-extrabold text-foreground">
          {tab === 'offer' ? 'Offer a Skill' : 'Request Help'}
        </h1>
      </div>

      {/* Tab Toggle */}
      <div className="px-4 mb-4">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setTab('offer')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              tab === 'offer' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Offer Help
          </button>
          <button
            onClick={() => setTab('request')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              tab === 'request' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Request Help
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 space-y-4 pb-8"
      >
        {/* Category Grid */}
        <CategoryGrid selected={category} onSelect={setCategory} />

        {/* Title */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="font-bold text-foreground mb-2">
            {tab === 'offer' ? 'What can you help with?' : 'What do you need help with?'}
          </h3>
          <Input
            placeholder="e.g., React development, guitar lessons, dog walking..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 rounded-lg border-border"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="font-bold text-foreground mb-2">Description</h3>
          <Textarea
            placeholder={tab === 'offer' ? 'Describe your skills, experience, and how you can help...' : 'Describe what you need, when, and any specific requirements...'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] rounded-lg border-border resize-none"
          />
        </div>

        {/* Availability */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="font-bold text-foreground mb-3">When are you available?</h3>
          <div className="space-y-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 h-10 rounded-lg border-border"
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Select value={timePreference} onValueChange={setTimePreference}>
                <SelectTrigger className="pl-10 h-10 rounded-lg border-border">
                  <SelectValue placeholder="Select time preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="weekend">Weekend</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="font-bold text-foreground mb-3">Location</h3>
          <div className="relative mb-3">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter address or use current location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-10 rounded-lg border-border"
            />
          </div>
          <div className="space-y-2">
            {[
              { id: 'my_location', label: 'At my location' },
              { id: 'their_location', label: 'At their location' },
              { id: 'online', label: 'Online/Remote' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLocationType(opt.id)}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${
                  locationType === opt.id
                    ? 'border-dogood-blue bg-dogood-blue'
                    : 'border-muted-foreground'
                }`} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          className="w-full h-12 rounded-full bg-gradient-to-r from-dogood-green to-dogood-teal text-white font-bold text-base"
        >
          {createMutation.isPending
            ? 'Posting...'
            : tab === 'offer'
            ? 'Post Offer'
            : 'Submit & Find Matches'}
        </Button>
      </motion.div>
    </div>
  );
}