import React from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categoryColors = {
  teaching: 'bg-dogood-blue/10 text-dogood-blue',
  tech_support: 'bg-purple-100 text-purple-700',
  repair: 'bg-orange-100 text-orange-700',
  caregiving: 'bg-pink-100 text-pink-700',
  cooking: 'bg-yellow-100 text-yellow-700',
  transport: 'bg-red-100 text-red-700',
  creative: 'bg-indigo-100 text-indigo-700',
  physical_help: 'bg-green-100 text-green-700',
  professional: 'bg-gray-100 text-gray-700',
  other: 'bg-slate-100 text-slate-600',
};

const categoryLabels = {
  teaching: 'Teaching',
  tech_support: 'Tech',
  repair: 'Repair',
  caregiving: 'Caregiving',
  cooking: 'Cooking',
  transport: 'Transport',
  creative: 'Creative',
  physical_help: 'Physical',
  professional: 'Professional',
  other: 'Other',
};

export default function FeedCard({ post, isOffer }) {
  const initials = (post.user_name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const bgColor = isOffer ? 'bg-dogood-green' : 'bg-dogood-blue';

  return (
    <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
      {/* User Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${bgColor} text-white flex items-center justify-center text-sm font-bold`}>
            {initials}
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">{post.user_name || 'Anonymous'}</p>
            {post.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {post.location}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {post.status === 'ongoing' ? (
            <Badge className="bg-orange-100 text-orange-600 border-orange-200 text-[10px] font-semibold">
              Ongoing
            </Badge>
          ) : post.availability ? (
            <Badge className="bg-green-50 text-dogood-green border-green-200 text-[10px] font-semibold">
              {post.availability}
            </Badge>
          ) : null}
          {post.user_rating > 0 && (
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground ml-1">
              <Star className="w-3.5 h-3.5 text-dogood-yellow fill-dogood-yellow" />
              {post.user_rating}
            </div>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="font-bold text-foreground mb-1">{post.title}</h3>
      {post.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={`${categoryColors[post.category] || categoryColors.other} text-xs font-semibold border-0`}>
            {categoryLabels[post.category] || post.category}
          </Badge>
          {post.offers_compensation && (
            <span className="text-xs text-muted-foreground">
              Offers: {post.offers_compensation}
            </span>
          )}
          {!isOffer && !post.offers_compensation && post.availability && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.availability}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className={`rounded-lg font-bold text-xs px-4 h-8 ${
            isOffer 
              ? 'bg-dogood-blue hover:bg-dogood-blue/90 text-white' 
              : 'bg-dogood-green hover:bg-dogood-green/90 text-white'
          }`}
        >
          {isOffer ? 'Connect' : 'Help'}
        </Button>
      </div>
    </div>
  );
}