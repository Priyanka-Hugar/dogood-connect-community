import React, { useState } from 'react';
import { auth, skillPosts } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import ProfileHeader from '@/components/profile/ProfileHeader';
import SkillsSection from '@/components/profile/SkillsSection';
import BadgesGrid from '@/components/profile/BadgesGrid';
import { motion } from 'framer-motion';

export default function Profile() {
  const [activeSection, setActiveSection] = useState('skills');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => auth.me(),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      const me = await auth.me();
      return skillPosts.filter({ created_by: me.email });
    },
  });

  const offerPosts = posts.filter(p => p.type === 'offer');
  const requestPosts = posts.filter(p => p.type === 'request');

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader user={user} />

      {/* Tab Selector */}
      <div className="px-4 mt-5 mb-2">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setActiveSection('skills')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSection === 'skills' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Skills & Requests
          </button>
          <button
            onClick={() => setActiveSection('badges')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSection === 'badges' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Badges
          </button>
        </div>
      </div>

      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-6"
      >
        {activeSection === 'skills' ? (
          <>
            <SkillsSection type="offer" posts={offerPosts} />
            <SkillsSection type="request" posts={requestPosts} />
          </>
        ) : (
          <div className="px-4 mt-3">
            <BadgesGrid />
          </div>
        )}
      </motion.div>
    </div>
  );
}