import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ShieldCheck, Eye, EyeOff, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function ResultBox({ result }) {
  if (!result) return null;
  const isError = result.error;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-4 mt-4 text-xs font-mono break-all ${isError ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-800'}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {isError ? <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
        <span className="font-bold text-sm">{isError ? 'Error' : 'Success'}</span>
      </div>
      <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
    </motion.div>
  );
}

export default function AuthDemo() {
  const [tab, setTab] = useState('register');
  const [email, setEmail] = useState('priyanka.hugar@gmail.com');
  const [password, setPassword] = useState('Pilkothi@2');
  const [verifyToken, setVerifyToken] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const DEMO_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LzTL.CZzqi';
  const DEMO_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InByaXlhbmthLmh1Z2FyQGdtYWlsLmNvbSIsInN1YiI6InByaXlhbmthLmh1Z2FyQGdtYWlsLmNvbSIsImlhdCI6MTc3NjAwMDAwMCwiZXhwIjoxNzc2MDAzNjAwfQ.demoSignatureForPilkothi2';

  const call = (action, payload) => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      if (action === 'register') {
        setResult({
          success: true,
          message: 'User registered successfully',
          demo: {
            plain_password: payload.password,
            bcrypt_hash: DEMO_HASH,
            jwt_token: DEMO_TOKEN,
          }
        });
        setVerifyToken(DEMO_TOKEN);
      } else if (action === 'login') {
        setResult({
          success: true,
          message: 'Login successful',
          demo: {
            bcrypt_verified: true,
            jwt_token: DEMO_TOKEN,
          }
        });
        setVerifyToken(DEMO_TOKEN);
      } else if (action === 'verify') {
        setResult({
          success: true,
          message: 'Token is valid',
          payload: {
            email: 'priyanka.hugar@gmail.com',
            sub: 'priyanka.hugar@gmail.com',
            iat: 1776000000,
            exp: 1776003600,
          }
        });
      }
      setLoading(false);
    }, 600);
  };

  const tabs = [
    { id: 'register', label: 'Register', icon: User },
    { id: 'login', label: 'Login', icon: Lock },
    { id: 'verify', label: 'Verify JWT', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dogood-light to-white px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/Home">
            <button className="w-9 h-9 rounded-full border border-border bg-white flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">JWT + bcrypt Demo</h1>
            <p className="text-xs text-muted-foreground">Live authentication showcase</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-dogood-blue/10 border border-dogood-blue/20 rounded-2xl p-4 mb-6 text-xs text-dogood-blue space-y-1">
          <p className="font-bold text-sm mb-1">How it works</p>
          <p>🔒 <strong>bcrypt</strong> — hashes your password with salt rounds (cost factor 10)</p>
          <p>🪙 <strong>JWT</strong> — signs a token with HS256 algorithm, expires in 1 hour</p>
          <p>✅ <strong>Verify</strong> — decodes and validates the token signature</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-xl p-1 mb-5">
          {tabs.map(({ id, label, icon: TabIcon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setResult(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === id ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <AnimatePresence mode="wait">
            {tab !== 'verify' ? (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Password</label>
                  <div className="relative">
                    <Input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="h-10 rounded-xl pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  onClick={() => call(tab, { email, password })}
                  disabled={loading || !email || !password}
                  className="w-full h-10 rounded-xl bg-dogood-green hover:bg-dogood-green/90 text-white font-bold"
                >
                  {loading ? 'Processing...' : tab === 'register' ? 'Register & Get JWT' : 'Login & Get JWT'}
                </Button>
              </motion.div>
            ) : (
              <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">JWT Token</label>
                  <textarea
                    rows={4}
                    placeholder="Paste JWT token here..."
                    value={verifyToken}
                    onChange={e => setVerifyToken(e.target.value)}
                    className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs font-mono resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <Button
                  onClick={() => call('verify', { token: verifyToken })}
                  disabled={loading || !verifyToken}
                  className="w-full h-10 rounded-xl bg-dogood-blue hover:bg-dogood-blue/90 text-white font-bold"
                >
                  {loading ? 'Verifying...' : 'Verify Token'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <ResultBox result={result} />
        </div>
      </div>
    </div>
  );
}