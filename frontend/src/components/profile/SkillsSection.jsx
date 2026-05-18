import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function SkillsSection({ type, posts }) {
  const navigate = useNavigate();
  const isOffer = type === 'offer';
  const title = isOffer ? 'Skills I Can Offer' : 'Help I Need';
  const buttonLabel = isOffer ? 'Add Skill' : 'Add Request';
  const emptyEmoji = isOffer ? '🎯' : '🙋';
  const emptyTitle = isOffer ? 'Share Your Skills' : 'Request Help';
  const emptyDesc = isOffer
    ? "Let your community know what you're good at! Add skills you can offer to help others."
    : "Everyone needs help sometimes! Add things you'd like assistance with from your community.";
  const emptyButton = isOffer ? 'Add Your First Skill' : 'Add Help Request';

  return (
    <div className="px-4 mt-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-extrabold text-foreground">{title}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/AddPost')}
          className="text-xs font-bold rounded-lg h-8"
        >
          {buttonLabel}
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-6 text-center">
          <span className="text-4xl block mb-2">{emptyEmoji}</span>
          <h3 className="font-bold text-foreground mb-1">{emptyTitle}</h3>
          <p className="text-xs text-muted-foreground mb-4 px-4">{emptyDesc}</p>
          <Button
            variant="outline"
            onClick={() => navigate('/AddPost')}
            className="w-full rounded-lg font-bold text-sm h-10"
          >
            {emptyButton}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-border p-3">
              <p className="font-bold text-sm text-foreground">{post.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{post.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}