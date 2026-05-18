import React from 'react';

const CATEGORIES = [
  { id: 'teaching', label: 'Teaching', emoji: '📚' },
  { id: 'tech_support', label: 'Tech Support', emoji: '💻' },
  { id: 'repair', label: 'Repair & Fix', emoji: '🔧' },
  { id: 'caregiving', label: 'Caregiving', emoji: '💖' },
  { id: 'cooking', label: 'Cooking', emoji: '👩‍🍳' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'physical_help', label: 'Physical Help', emoji: '💪' },
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'other', label: 'Other', emoji: '➕' },
];

export default function CategoryGrid({ selected, onSelect }) {
  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <h3 className="font-bold text-foreground mb-3">Choose Category</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition-all ${
              selected === cat.id
                ? 'border-dogood-blue bg-dogood-blue/5'
                : 'border-border bg-white hover:border-muted-foreground/30'
            }`}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-xs font-semibold text-foreground">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}