import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { skillPosts } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CategoryGrid from '@/components/addpost/CategoryGrid';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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

  const createMutation = useMutation({
    mutationFn: (data) => skillPosts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPosts'] });
      toast.success('Posted successfully!');
      navigate('/Home');
    },
  });

  const handleSubmit = () => {
    if (!category || !title) {
      toast.error('Please fill in at least the category and title.');
      return;
    }
    createMutation.mutate({
      type: tab === 'offer' ? 'offer' : 'request',
      category,
      title,
      description,
      availability: timePreference ? `${date} ${timePreference}` : date,
      location,
      location_type: locationType,
      status: 'active',
      user_name: 'You',
    });
  };

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
            placeholder="Describe your skills, experience, and how you can help..."
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
          {createMutation.isPending ? 'Posting...' : tab === 'offer' ? 'Post Offer' : 'Submit Request'}
        </Button>
      </motion.div>
    </div>
  );
}