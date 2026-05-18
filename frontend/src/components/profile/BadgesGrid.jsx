import React from 'react';
import { Lock } from 'lucide-react';

const BADGES = [
  { id: 'new_member', emoji: '🎉', label: 'New Member', description: 'Welcome to DoGood!', unlocked: true },
  { id: 'helper', emoji: '🤝', label: 'Helper', description: 'Help 10+ people', unlocked: false },
  { id: 'community_builder', emoji: '🏆', label: 'Community Builder', description: 'Active member for 6+ months', unlocked: false },
  { id: 'mentor', emoji: '🧑‍🎓', label: 'Mentor', description: 'Mentor 5+ people', unlocked: false },
  { id: 'super_helper', emoji: '⚡', label: 'Super Helper', description: '50+ hours helped', unlocked: false },
  { id: 'top_rated', emoji: '🌟', label: 'Top Rated', description: '4.8+ rating', unlocked: false },
];

export default function BadgesGrid() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {BADGES.map((badge) => (
        <div
          key={badge.id}
          className={`rounded-xl border-2 p-4 text-center transition-all ${
            badge.unlocked
              ? 'border-dogood-green/30 bg-dogood-green/5'
              : 'border-border bg-white opacity-60'
          }`}
        >
          <span className="text-3xl block mb-1.5">{badge.emoji}</span>
          <p className="text-sm font-bold text-foreground">{badge.label}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</p>
          {badge.unlocked && (
            <span className="text-dogood-blue text-lg mt-1 block">🏅</span>
          )}
          {!badge.unlocked && (
            <Lock className="w-3.5 h-3.5 text-muted-foreground mx-auto mt-1.5" />
          )}
        </div>
      ))}
    </div>
  );
}