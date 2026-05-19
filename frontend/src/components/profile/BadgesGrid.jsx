import React from 'react';
import { Lock, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const BADGES = [
  { id: 'new_member', emoji: '🎉', label: 'New Member', description: 'Welcome to DoGood!', unlocked: true },
  { id: 'helper', emoji: '🤝', label: 'Helper', description: 'Help 10+ people', unlocked: false },
  { id: 'community_builder', emoji: '🏆', label: 'Community Builder', description: 'Active member for 6+ months', unlocked: false },
  { id: 'mentor', emoji: '🧑‍🎓', label: 'Mentor', description: 'Mentor 5+ people', unlocked: false },
  { id: 'super_helper', emoji: '⚡', label: 'Super Helper', description: '50+ hours helped', unlocked: false },
  { id: 'top_rated', emoji: '🌟', label: 'Top Rated', description: '4.8+ rating', unlocked: false },
];

function downloadBadgePDF(badge, userName) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

  // Background
  doc.setFillColor(240, 250, 245);
  doc.rect(0, 0, 148, 210, 'F');

  // Border
  doc.setDrawColor(27, 186, 110);
  doc.setLineWidth(2);
  doc.rect(8, 8, 132, 194, 'S');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(27, 186, 110);
  doc.text('DoGood Connect', 74, 35, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(80, 80, 80);
  doc.text('Certificate of Achievement', 74, 46, { align: 'center' });

  // Divider
  doc.setDrawColor(27, 186, 110);
  doc.setLineWidth(0.5);
  doc.line(20, 52, 128, 52);

  // Emoji (as text)
  doc.setFontSize(36);
  doc.text(badge.emoji, 74, 80, { align: 'center' });

  // Badge name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text(badge.label, 74, 100, { align: 'center' });

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(badge.description, 74, 112, { align: 'center' });

  // Name line
  if (userName) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Awarded to: ${userName}`, 74, 128, { align: 'center' });
  }

  // Awarded line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(130, 130, 130);
  doc.text(`Date: ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`, 74, 140, { align: 'center' });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(27, 186, 110);
  doc.text('dogoodconnect.com', 74, 195, { align: 'center' });

  doc.save(`DoGood-Badge-${badge.label.replace(/\s+/g, '-')}.pdf`);
}

export default function BadgesGrid({ userName }) {
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
          {badge.unlocked ? (
            <button
              onClick={() => downloadBadgePDF(badge, userName)}
              className="mt-2 flex items-center gap-1 text-[10px] text-dogood-green font-bold mx-auto bg-dogood-green/10 rounded-full px-2.5 py-1 hover:bg-dogood-green/20 transition-colors"
            >
              <Download className="w-3 h-3" /> Download PDF
            </button>
          ) : (
            <Lock className="w-3.5 h-3.5 text-muted-foreground mx-auto mt-1.5" />
          )}
        </div>
      ))}
    </div>
  );
}