import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, User, Lock, MapPin, HelpCircle, Mail, Shield, ChevronRight, Eye, EyeOff, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

function SectionHeader({ title }) {
  return <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 mt-6 mb-1">{title}</p>;
}

function SettingsRow({ icon: Icon, label, sublabel, onClick, danger, toggle, toggled }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-4 bg-white border-b border-border last:border-0 hover:bg-muted/40 transition-colors ${danger ? 'text-red-500' : 'text-foreground'}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50' : 'bg-muted'}`}>
        <Icon className={`w-4 h-4 ${danger ? 'text-red-500' : 'text-muted-foreground'}`} />
      </div>
      <div className="flex-1 text-left">
        <p className={`text-sm font-semibold ${danger ? 'text-red-500' : 'text-foreground'}`}>{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
      </div>
      {toggle !== undefined ? (
        <div
          className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${toggled ? 'bg-dogood-green' : 'bg-muted'}`}
          onClick={e => { e.stopPropagation(); onClick(); }}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${toggled ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      ) : (
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        className="bg-white w-full max-w-lg rounded-t-3xl flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0">
          <h2 className="text-lg font-extrabold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto px-6 pb-24">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Settings() {
  const [activeModal, setActiveModal] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  // Edit Profile state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  // Change Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState('');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => auth.me(),
    onSuccess: (u) => {
      if (u) {
        setName(u.full_name || u.name || '');
        setBio(u.bio || '');
        setLocation(u.location || '');
      }
    }
  });

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); setActiveModal(null); }, 1200);
  };

  const handleChangePassword = () => {
    setPwError('');
    if (newPw.length < 6) return setPwError('Password must be at least 6 characters.');
    if (newPw !== confirmPw) return setPwError('Passwords do not match.');
    setSaved(true);
    setTimeout(() => { setSaved(false); setActiveModal(null); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }, 1200);
  };

  const FAQ_ITEMS = [
    { q: 'How do I offer a skill?', a: 'Go to the Home tab and tap the + button to create a new skill offer.' },
    { q: 'Is DoGood free to use?', a: 'Yes! DoGood is completely free. No payments are ever required.' },
    { q: 'How are helpers rated?', a: 'After each exchange, both parties can leave a star rating and short review.' },
    { q: 'Can I use DoGood anonymously?', a: 'You need an account, but you control how much personal info is visible.' },
  ];

  const PRIVACY_ITEMS = [
    'We only use your location to show nearby helpers.',
    'We never sell your personal data to third parties.',
    'You can delete your account and all data at any time.',
    'Messages are private between participants only.',
  ];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4 flex items-center gap-3 shadow-sm">
        <Link to="/Profile">
          <button className="w-8 h-8 rounded-full border border-border bg-white flex items-center justify-center">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </Link>
        <h1 className="text-lg font-extrabold text-foreground">Settings</h1>
      </div>

      {/* Account */}
      <SectionHeader title="Account" />
      <div className="mx-4 rounded-2xl overflow-hidden border border-border">
        <SettingsRow icon={User} label="Edit Profile" sublabel={user?.full_name || 'Update your name, bio & location'} onClick={() => setActiveModal('editProfile')} />
        <SettingsRow icon={Lock} label="Change Password" sublabel="Update your account password" onClick={() => setActiveModal('changePassword')} />
      </div>

      {/* Privacy */}
      <SectionHeader title="Privacy" />
      <div className="mx-4 rounded-2xl overflow-hidden border border-border">
        <SettingsRow
          icon={MapPin}
          label="Location Services"
          sublabel={locationEnabled ? 'Enabled — helpers can find you' : 'Disabled — your location is hidden'}
          onClick={() => setLocationEnabled(!locationEnabled)}
          toggle
          toggled={locationEnabled}
        />
        <SettingsRow icon={Shield} label="Privacy Policy" sublabel="How we handle your data" onClick={() => setActiveModal('privacy')} />
      </div>

      {/* Support */}
      <SectionHeader title="Support" />
      <div className="mx-4 rounded-2xl overflow-hidden border border-border">
        <SettingsRow icon={HelpCircle} label="FAQ" sublabel="Common questions answered" onClick={() => setActiveModal('faq')} />
        <SettingsRow icon={Mail} label="Contact Us" sublabel="Get in touch with the DoGood team" onClick={() => setActiveModal('contact')} />
      </div>

      {/* Modals */}
      <AnimatePresence>

        {activeModal === 'editProfile' && (
          <Modal title="Edit Profile" onClose={() => setActiveModal(null)}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Full Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} className="h-11 rounded-xl" placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell the community about yourself..."
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Location</label>
                <Input value={location} onChange={e => setLocation(e.target.value)} className="h-11 rounded-xl" placeholder="e.g. Fitzroy, Melbourne" />
              </div>
              <Button onClick={handleSaveProfile} className="w-full h-11 rounded-full bg-dogood-green hover:bg-dogood-green/90 text-white font-bold">
                {saved ? <><Check className="w-4 h-4 mr-1" /> Saved!</> : 'Save Changes'}
              </Button>
            </div>
          </Modal>
        )}

        {activeModal === 'changePassword' && (
          <Modal title="Change Password" onClose={() => setActiveModal(null)}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Current Password</label>
                <div className="relative">
                  <Input type={showPw ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="h-11 rounded-xl pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">New Password</label>
                <Input type={showPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} className="h-11 rounded-xl" placeholder="Min. 6 characters" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Confirm New Password</label>
                <Input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="h-11 rounded-xl" placeholder="Repeat new password" />
              </div>
              {pwError && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{pwError}</p>}
              <Button onClick={handleChangePassword} disabled={!currentPw || !newPw || !confirmPw} className="w-full h-11 rounded-full bg-dogood-green hover:bg-dogood-green/90 text-white font-bold">
                {saved ? <><Check className="w-4 h-4 mr-1" /> Updated!</> : 'Update Password'}
              </Button>
            </div>
          </Modal>
        )}

        {activeModal === 'faq' && (
          <Modal title="FAQ" onClose={() => setActiveModal(null)}>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="bg-muted rounded-xl p-4">
                  <p className="text-sm font-bold text-foreground mb-1">{item.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </Modal>
        )}

        {activeModal === 'contact' && (
          <Modal title="Contact Us" onClose={() => setActiveModal(null)}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Have a question, issue, or feedback? We'd love to hear from you.
              </p>
              <div className="bg-muted rounded-xl p-4 space-y-2">
                <p className="text-sm font-bold text-foreground">📧 Email</p>
                <p className="text-sm text-dogood-green font-semibold">support@dogoodconnect.com</p>
              </div>
              <div className="bg-muted rounded-xl p-4 space-y-2">
                <p className="text-sm font-bold text-foreground">⏰ Response Time</p>
                <p className="text-sm text-muted-foreground">We typically respond within 24–48 hours on business days.</p>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Send us a message</label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue or feedback..."
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <Button className="w-full h-11 rounded-full bg-dogood-green hover:bg-dogood-green/90 text-white font-bold">
                Send Message
              </Button>
            </div>
          </Modal>
        )}

        {activeModal === 'privacy' && (
          <Modal title="Privacy Policy" onClose={() => setActiveModal(null)}>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                DoGood Connect is committed to protecting your privacy. Here's a summary of how we handle your data:
              </p>
              {PRIVACY_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-muted rounded-xl p-3">
                  <Shield className="w-4 h-4 text-dogood-green flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                For the full privacy policy, visit dogoodconnect.com/privacy or contact us at support@dogoodconnect.com
              </p>
            </div>
          </Modal>
        )}

      </AnimatePresence>
    </div>
  );
}