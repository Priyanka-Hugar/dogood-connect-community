import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Video, MoreVertical, Send, MapPin, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DEMO_MESSAGES = [
  {
    id: 1,
    sender: 'them',
    content: "Hi! I saw you're interested in web development help. I'd be happy to help you with your React project!",
    time: '2:30 PM',
  },
  {
    id: 2,
    sender: 'me',
    content: "That's great! I'm working on a small e-commerce site and I'm stuck on the shopping cart functionality.",
    time: '2:32 PM',
  },
  {
    id: 3,
    sender: 'them',
    content: 'Perfect! Shopping carts can be tricky. Are you using any state management library like Redux, or just React hooks?',
    time: '2:35 PM',
  },
  {
    id: 4,
    sender: 'me',
    content: "Just React hooks for now. I'm trying to keep it simple since I'm still learning.",
    time: '2:37 PM',
  },
  {
    id: 5,
    sender: 'them',
    content: "That's smart! Hooks are perfect for this. When would be a good time to meet? I'm free this Saturday afternoon if that works for you.",
    time: '2:40 PM',
  },
];

export default function Chat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-border px-3 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/Messages')}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="w-9 h-9 rounded-full bg-dogood-blue text-white flex items-center justify-center text-sm font-bold">
          SC
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-foreground">Sarah Chen</p>
          <p className="text-[10px] text-muted-foreground">⭐ 4.9 · Usually responds in 30 min</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-dogood-blue"><Phone className="w-4 h-4" /></button>
          <button className="p-1.5 text-dogood-blue"><Video className="w-4 h-4" /></button>
          <button className="p-1.5 text-muted-foreground"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Skill Details Card */}
      {showDetails && (
        <div className="mx-3 mt-3 bg-white rounded-xl border border-border p-4 relative">
          <button
            onClick={() => setShowDetails(false)}
            className="absolute top-3 right-3 text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-foreground mb-1">Web Development Help</h3>
          <p className="text-sm text-muted-foreground mb-3">
            I can help with React, HTML/CSS, and basic JavaScript projects
          </p>
          <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
            <Badge className="bg-dogood-blue/10 text-dogood-blue border-0 text-xs">Tech</Badge>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> 0.5 mi away</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> This weekend</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-dogood-green hover:bg-dogood-green/90 text-white rounded-lg font-bold text-xs h-8 px-4">
              Confirm Help Session
            </Button>
            <Button size="sm" variant="outline" className="rounded-lg font-bold text-xs h-8 px-4">
              Decline
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
        {DEMO_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
                msg.sender === 'me'
                  ? 'bg-dogood-blue text-white rounded-br-sm'
                  : 'bg-white border border-border text-foreground rounded-bl-sm'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Rating Banner */}
      <div className="bg-dogood-yellow/20 text-center py-2 text-xs font-semibold text-dogood-orange">
        Session completed? Rate your experience!
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-border px-3 py-3 flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 h-10 rounded-full border-border text-sm"
        />
        <Button
          size="icon"
          className="w-10 h-10 rounded-full bg-dogood-blue hover:bg-dogood-blue/90"
        >
          <Send className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
}