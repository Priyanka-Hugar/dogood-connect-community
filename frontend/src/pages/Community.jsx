import React, { useState } from 'react';
import { Star, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LEADERBOARD = [
  { rank: 1, name: 'Emma Rodriguez', hours: 142, badges: 8, initials: 'ER', color: 'bg-dogood-green' },
  { rank: 2, name: 'James Wilson', hours: 98, badges: 6, initials: 'JW', color: 'bg-dogood-blue' },
  { rank: 3, name: 'Sarah Chen', hours: 87, badges: 5, initials: 'SC', color: 'bg-dogood-teal' },
  { rank: 4, name: 'Miguel Rodriguez', hours: 74, badges: 4, initials: 'MR', color: 'bg-dogood-orange' },
  { rank: 5, name: 'Anna Lee', hours: 61, badges: 3, initials: 'AL', color: 'bg-purple-400' },
  { rank: 6, name: 'David Kim', hours: 45, badges: 3, initials: 'DK', color: 'bg-pink-400' },
];

const ACHIEVEMENTS = [
  { label: 'Hours Helped', current: 0, target: 10, emoji: '⏱️' },
  { label: 'People Reached', current: 0, target: 5, emoji: '🤝' },
  { label: 'Posts Created', current: 0, target: 3, emoji: '📝' },
];

const rankColors = ['text-dogood-yellow', 'text-gray-400', 'text-amber-600'];

export default function Community() {
  const [activeTab, setActiveTab] = useState('leaderboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-dogood-blue to-dogood-teal px-4 pt-8 pb-6">
        <h1 className="text-white font-extrabold text-xl">Community</h1>
        <p className="text-white/80 text-xs mt-0.5">See how your community is helping each other</p>

        {/* Community Milestone */}
        <div className="mt-4 bg-white/15 rounded-xl p-4 text-center">
          <p className="text-white font-bold text-sm mb-1">🎉 Together we've logged</p>
          <p className="text-white font-extrabold text-2xl">1,000+ hours of help!</p>
          <p className="text-white/70 text-xs mt-1">Keep it going, DoGood community!</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 mb-4">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'leaderboard' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'achievements' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Achievements
          </button>
        </div>
      </div>

      {activeTab === 'leaderboard' && (
        <div className="px-4 space-y-2">
          {/* Top 3 Podium */}
          <div className="flex items-end justify-center gap-2 mb-6 px-4 pt-2">
            {/* 2nd */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-12 h-12 rounded-full bg-dogood-blue text-white flex items-center justify-center font-bold text-sm">JW</div>
              <div className="bg-gray-100 rounded-t-lg w-full h-16 flex flex-col items-center justify-end pb-2">
                <p className="text-gray-500 font-bold text-lg">2</p>
                <p className="text-xs text-muted-foreground">98h</p>
              </div>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <Trophy className="w-5 h-5 text-dogood-yellow" />
              <div className="w-14 h-14 rounded-full bg-dogood-green text-white flex items-center justify-center font-bold text-sm border-2 border-dogood-yellow">ER</div>
              <div className="bg-dogood-yellow/20 rounded-t-lg w-full h-24 flex flex-col items-center justify-end pb-2">
                <p className="text-dogood-yellow font-bold text-2xl">1</p>
                <p className="text-xs text-muted-foreground">142h</p>
              </div>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-12 h-12 rounded-full bg-dogood-teal text-white flex items-center justify-center font-bold text-sm">SC</div>
              <div className="bg-amber-50 rounded-t-lg w-full h-12 flex flex-col items-center justify-end pb-2">
                <p className="text-amber-600 font-bold text-lg">3</p>
                <p className="text-xs text-muted-foreground">87h</p>
              </div>
            </div>
          </div>

          {/* Rest of list */}
          {LEADERBOARD.slice(3).map((person, idx) => (
            <motion.div
              key={person.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-border p-3 flex items-center gap-3"
            >
              <span className="text-sm font-bold text-muted-foreground w-5 text-center">{person.rank}</span>
              <div className={`w-10 h-10 rounded-full ${person.color} text-white flex items-center justify-center text-sm font-bold`}>
                {person.initials}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-foreground">{person.name}</p>
                <p className="text-xs text-muted-foreground">{person.badges} badges</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-dogood-teal">{person.hours}h</p>
                <p className="text-xs text-muted-foreground">helped</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="px-4 space-y-4">
          {/* Progress Bars */}
          {ACHIEVEMENTS.map((ach, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{ach.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-foreground">{ach.label}</span>
                    <span className="text-muted-foreground">{ach.current}/{ach.target}</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-dogood-blue to-dogood-green rounded-full"
                      style={{ width: `${(ach.current / ach.target) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Badge Grid */}
          <h3 className="font-extrabold text-foreground mt-2">Your Badges</h3>
          <div className="grid grid-cols-3 gap-2 pb-4">
            {[
              { emoji: '🎉', label: 'New Member', unlocked: true },
              { emoji: '🤝', label: 'Helper', unlocked: false },
              { emoji: '🏆', label: 'Builder', unlocked: false },
              { emoji: '🦸', label: 'Mentor', unlocked: false },
              { emoji: '⚡', label: 'Rapid', unlocked: false },
              { emoji: '⭐', label: 'Top Rated', unlocked: false },
            ].map((b, i) => (
              <div
                key={i}
                className={`flex flex-col items-center p-3 rounded-xl border-2 ${
                  b.unlocked ? 'border-green-200 bg-green-50' : 'border-border bg-muted opacity-50'
                }`}
              >
                <span className="text-2xl">{b.emoji}</span>
                <span className="text-xs font-semibold mt-1 text-center">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}