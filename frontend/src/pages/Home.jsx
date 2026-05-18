import React, { useState } from 'react';
import { Search, SlidersHorizontal, List, Map, MapPin, Clock, Star, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { skillPosts } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

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

const DEMO_OFFERS = [
  {
    id: 'd1', user_name: 'Sarah Chen', location: '1.2 km (Fitzroy)', title: 'Web Development Help',
    description: 'I can help with React, HTML/CSS, and basic JavaScript projects', category: 'tech_support',
    availability: 'This weekend', user_rating: 4.9, type: 'offer', status: 'active',
  },
  {
    id: 'd2', user_name: 'Miguel Rodriguez', location: '2.8 km (Richmond)', title: 'Bike Repair & Maintenance',
    description: 'Professional mechanic offering bike tune-ups and repairs', category: 'repair',
    availability: 'Weekdays', user_rating: 5, type: 'offer', status: 'active',
  },
  {
    id: 'd3', user_name: 'Emma Johnson', location: '0.5 km (Fitzroy)', title: 'Guitar Lessons for Beginners',
    description: 'I can teach basic chords and music theory. All ages welcome!', category: 'teaching',
    availability: 'Weekends', user_rating: 4.7, type: 'offer', status: 'active',
  },
];

const DEMO_REQUESTS = [
  {
    id: 'r1', user_name: 'David Kim', location: '0.8 km (Collingwood)', title: 'Moving Help Needed',
    description: 'Need help moving furniture to new apartment this Saturday', category: 'physical_help',
    availability: 'This week', offers_compensation: '$50', type: 'request', status: 'active',
  },
  {
    id: 'r2', user_name: 'Lisa Wang', location: '3.1 km (St Kilda)', title: 'Math Tutoring for Teen',
    description: 'Looking for someone to help my daughter with algebra', category: 'teaching',
    offers_compensation: 'Trade for piano lessons', type: 'request', status: 'ongoing',
  },
  {
    id: 'r3', user_name: 'Tom Brady', location: '1.4 km (Carlton)', title: 'Help with Tax Return',
    description: 'Need an accountant or someone familiar with Australian tax returns', category: 'professional',
    availability: 'This month', offers_compensation: 'Home cooked meal', type: 'request', status: 'active',
  },
];

function FeedCard({ post }) {
  const isOffer = post.type === 'offer';
  const initials = (post.user_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarBg = isOffer ? 'bg-blue-100 text-dogood-blue' : 'bg-green-100 text-dogood-green';

  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full ${avatarBg} flex items-center justify-center text-sm font-extrabold`}>
            {initials}
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">{post.user_name}</p>
            {post.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
                <MapPin className="w-3 h-3" /> {post.location}
              </p>
            )}
          </div>
        </div>
        <div>
          {post.status === 'ongoing' ? (
            <span className="text-xs font-semibold text-dogood-orange border border-dogood-orange rounded-full px-2.5 py-0.5">
              Ongoing
            </span>
          ) : post.availability ? (
            <span className="text-xs font-semibold text-dogood-orange border border-dogood-orange rounded-full px-2.5 py-0.5">
              {post.availability}
            </span>
          ) : post.user_rating ? (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-3.5 h-3.5 text-dogood-yellow" />
              {post.user_rating}
            </div>
          ) : null}
          {post.user_rating && (post.status !== 'ongoing') && post.availability ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 justify-end">
              <Star className="w-3 h-3 text-dogood-yellow" />
              {post.user_rating}
            </div>
          ) : null}
        </div>
      </div>

      <h3 className="font-extrabold text-foreground text-base mb-1.5">{post.title}</h3>
      {post.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{post.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`${categoryColors[post.category] || categoryColors.other} font-semibold border-0 text-xs rounded-full px-2.5`}>
            {categoryLabels[post.category] || post.category}
          </Badge>
          {post.offers_compensation && (
            <span className="text-xs text-muted-foreground">Offers: {post.offers_compensation}</span>
          )}
          {isOffer && post.availability && !post.user_rating && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.availability}
            </span>
          )}
          {isOffer && post.availability && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.availability}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className={`rounded-xl font-bold text-xs px-5 h-8 ${
            isOffer ? 'bg-dogood-blue hover:bg-dogood-blue/90 text-white' : 'bg-dogood-green hover:bg-dogood-green/90 text-white'
          }`}
        >
          {isOffer ? 'Connect' : 'Help'}
        </Button>
      </div>
    </div>
  );
}

// Map suburb names to approximate Melbourne coordinates
const SUBURB_COORDS = {
  fitzroy:    [-37.7963, 144.9779],
  richmond:   [-37.8183, 144.9980],
  collingwood:[-37.8042, 144.9857],
  'st kilda': [-37.8679, 144.9815],
  carlton:    [-37.7979, 144.9664],
};

function extractCoords(location) {
  if (!location) return null;
  const match = location.match(/\(([^)]+)\)/);
  if (!match) return null;
  const suburb = match[1].toLowerCase();
  return SUBURB_COORDS[suburb] || null;
}

function openGoogleMapsWithPins(posts) {
  const valid = posts.filter(p => extractCoords(p.location));
  if (valid.length === 0) {
    // Fallback: open Google Maps centered on Melbourne
    window.open('https://maps.google.com/?q=Melbourne,Australia', '_blank');
    return;
  }
  if (valid.length === 1) {
    const [lat, lng] = extractCoords(valid[0].location);
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
    return;
  }
  // Build a Google Maps search URL with all locations as waypoints
  const markers = valid.map(p => {
    const [lat, lng] = extractCoords(p.location);
    return `${lat},${lng}`;
  });
  // Use the first as origin, last as destination, rest as waypoints
  const origin = markers[0];
  const destination = markers[markers.length - 1];
  const waypoints = markers.slice(1, -1).join('|');
  const url = waypoints
    ? `https://www.google.com/maps/dir/${[origin, ...markers.slice(1)].join('/')}`
    : `https://www.google.com/maps/dir/${origin}/${destination}`;
  window.open(url, '_blank');
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('offers');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResults, setAiResults] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const { data: posts = [] } = useQuery({
    queryKey: ['skillPosts'],
    queryFn: () => skillPosts.list(),
  });

  const offersFromDB = posts.filter(p => p.type === 'offer');
  const requestsFromDB = posts.filter(p => p.type === 'request');
  const allOffers = offersFromDB.length > 0 ? offersFromDB : DEMO_OFFERS;
  const allRequests = requestsFromDB.length > 0 ? requestsFromDB : DEMO_REQUESTS;
  const feed = activeTab === 'offers' ? allOffers : allRequests;

  const handleAiMatch = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiError('');
    setAiResults(null);
    const matched = await fetch('http://localhost:4000/api/match-skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: aiQuery, posts: feed }),
    }).then(r => r.json());
    if (matched?.ranked) {
      setAiResults(matched.ranked);
    } else {
      setAiError(matched?.error || 'Something went wrong. Try again.');
    }
    setAiLoading(false);
  };

  const clearAiMatch = () => {
    setAiResults(null);
    setAiQuery('');
    setAiError('');
  };

  const filtered = aiResults
    ? aiResults
    : searchQuery
    ? feed.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : feed;

  return (
    <div className="bg-background min-h-screen">
      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search skills, requests, or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-full bg-white border-border text-sm"
            />
          </div>
          <button className="w-11 h-11 flex-shrink-0 rounded-full border border-border bg-white flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* AI Match Bar */}
      <div className="px-4 pb-3">
        <div className="bg-gradient-to-r from-dogood-green/10 to-dogood-blue/10 border border-dogood-green/30 rounded-2xl p-3">
          <p className="text-xs font-bold text-dogood-green mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Smart Match
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. I need help moving furniture..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiMatch()}
              className="h-9 rounded-xl text-sm bg-white border-dogood-green/30 flex-1"
            />
            <Button
              onClick={handleAiMatch}
              disabled={aiLoading || !aiQuery.trim()}
              className="h-9 rounded-xl bg-dogood-green hover:bg-dogood-green/90 text-white text-xs font-bold px-4"
            >
              {aiLoading ? 'Matching...' : 'Match'}
            </Button>
          </div>
          {aiError && <p className="text-xs text-red-500 mt-1.5">{aiError}</p>}
          {aiResults && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">Showing {aiResults.length} AI-ranked results</p>
              <button onClick={clearAiMatch} className="text-xs text-dogood-blue flex items-center gap-1 font-semibold">
                <X className="w-3 h-3" /> Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title + View Toggle */}
      <div className="px-4 flex items-center justify-between mb-2 mt-1">
        <h1 className="text-xl font-extrabold text-foreground">Community Help</h1>
        <div className="flex items-center bg-white rounded-lg border border-border overflow-hidden">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-foreground bg-white"
          >
            <List className="w-3.5 h-3.5" /> List
          </button>
          <button
            onClick={() => openGoogleMapsWithPins(filtered)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors border-l border-border text-muted-foreground"
          >
            <Map className="w-3.5 h-3.5" /> Map
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'offers' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Skills Available
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'requests' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Help Needed
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 space-y-3 pb-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {post.similarity !== undefined && (
                <div className="flex items-center gap-1 mb-1 ml-1">
                  <Sparkles className="w-3 h-3 text-dogood-green" />
                  <span className="text-xs text-dogood-green font-bold">
                    {Math.round(post.similarity * 100)}% match
                  </span>
                </div>
              )}
              <FeedCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No results found.</p>
          </div>
        )}
      </div>
    </div>
  );
}