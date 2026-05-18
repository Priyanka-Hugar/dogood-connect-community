import React from 'react';
import { Settings, LogOut, MapPin, Star, Pencil } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { auth } from '@/lib/api';
import { Link } from 'react-router-dom';

export default function ProfileHeader({ user }) {
  const handleLogout = () => {
    auth.logout('/Welcome');
  };
  const name = user?.full_name || user?.name || 'User';
  const location = user?.location || 'Set your location';
  const hoursHelped = user?.hours_helped || 0;
  const peopleHelped = user?.people_helped || 0;
  const rating = user?.rating || '-';
  const profileCompletion = user?.profile_completion || 25;
  const initial = name.charAt(0).toUpperCase();

  return (
    <div>
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-dogood-blue to-dogood-green px-4 pt-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-extrabold text-white">My Profile</h1>
          <div className="flex items-center gap-2">
            <Link to="/Settings">
              <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </button>
            </Link>
            <button onClick={handleLogout} className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-extrabold text-lg">{name}</h2>
            <p className="text-white/80 text-xs leading-relaxed">
              Welcome to DoGood! Complete your profile to start helping and receiving help from your community.
            </p>
            <p className="text-white/90 text-xs mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {location}
            </p>
          </div>
          <button className="text-white/80">
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          <div className="text-center">
            <p className="text-white font-extrabold text-xl">{hoursHelped}</p>
            <p className="text-white/70 text-[10px] font-semibold">Hours Helped</p>
          </div>
          <div className="text-center">
            <p className="text-white font-extrabold text-xl">{peopleHelped}</p>
            <p className="text-white/70 text-[10px] font-semibold">People Helped</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-dogood-yellow" />
              <p className="text-white font-extrabold text-xl">{rating}</p>
            </div>
            <p className="text-white/70 text-[10px] font-semibold">Rating</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mx-4 -mt-3 bg-white/90 backdrop-blur rounded-xl px-4 py-3 shadow-sm border border-border">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-foreground font-semibold">Complete your profile to get started</span>
          <span className="text-dogood-green font-bold">{profileCompletion}%</span>
        </div>
        <Progress value={profileCompletion} className="h-2 bg-muted" />
      </div>
    </div>
  );
}