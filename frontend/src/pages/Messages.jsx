import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DEMO_CONVERSATIONS = [
  {
    id: '1',
    name: 'Sarah Chen',
    lastMessage: 'That\'s smart! Hooks are perfect for this. When would be a good time to meet?',
    time: '2:40 PM',
    unread: 2,
    skill: 'Web Development Help',
  },
  {
    id: '2',
    name: 'Miguel Rodriguez',
    lastMessage: 'I can check your bike this Saturday morning.',
    time: '11:20 AM',
    unread: 0,
    skill: 'Bike Repair',
  },
  {
    id: '3',
    name: 'Lisa Wang',
    lastMessage: 'My daughter loved the lesson! Thank you so much.',
    time: 'Yesterday',
    unread: 0,
    skill: 'Math Tutoring',
  },
  {
    id: '4',
    name: 'David Kim',
    lastMessage: 'Perfect, I\'ll bring my truck on Saturday.',
    time: 'Yesterday',
    unread: 1,
    skill: 'Moving Help',
  },
];

export default function Messages() {
  const navigate = useNavigate();

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase();

  const getColor = (name) => {
    const colors = ['bg-dogood-green', 'bg-dogood-blue', 'bg-dogood-teal', 'bg-dogood-orange'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-lg font-extrabold text-foreground">Messages</h1>
      </div>

      <div className="px-4 space-y-1">
        {DEMO_CONVERSATIONS.map((conv, idx) => (
          <motion.button
            key={conv.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => navigate(`/Chat/${conv.id}`)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
          >
            <div className={`w-11 h-11 rounded-full ${getColor(conv.name)} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
              {getInitials(conv.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm text-foreground">{conv.name}</p>
                <span className="text-[10px] text-muted-foreground">{conv.time}</span>
              </div>
              <p className="text-xs text-dogood-blue font-semibold">{conv.skill}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
            </div>
            {conv.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-dogood-green text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {conv.unread}
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}