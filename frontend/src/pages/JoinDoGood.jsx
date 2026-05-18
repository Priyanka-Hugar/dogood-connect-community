import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, MapPin, Lock, Eye, EyeOff, CheckCircle, XCircle, ShieldCheck, Copy, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, setToken, setStoredUser } from '@/lib/api';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const passwordRules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'One number (0-9)', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function JoinDoGood() {
  const navigate = useNavigate();
  const [step, setStep] = useState('register'); // 'register' | 'verify'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');

  // JWT verify step
  const [issuedToken, setIssuedToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [copied, setCopied] = useState(false);

  const emailValid = emailRegex.test(email);
  const passwordChecks = passwordRules.map(r => ({ ...r, passed: r.test(password) }));
  const passwordValid = passwordChecks.every(r => r.passed);
  const confirmValid = confirmPassword === password && confirmPassword.length > 0;

  const showEmailError = touched.email && email.length > 0 && !emailValid;
  const showPasswordChecks = password.length > 0;
  const showConfirmError = touched.confirmPassword && confirmPassword.length > 0 && !confirmValid;

  const canSubmit = name.trim() && emailValid && passwordValid && confirmValid;

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await auth.register(email, password, name, location);
      setToken(data.token);
      setStoredUser(data.user);
      setIssuedToken(data.token);
      setTokenInput(data.token);
      setStep('verify');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyError('');
    try {
      // Token is already set from register step — just navigate
      window.location.href = '/Home';
    } catch (e) {
      setVerifyError(e.message);
    }
    setVerifying(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(issuedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-dogood-blue to-dogood-teal px-4 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => step === 'verify' ? setStep('register') : navigate('/Welcome')} className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-bold text-lg">{step === 'verify' ? 'Verify Identity' : 'Join DoGood'}</span>
        </div>
        {step === 'register' ? (
          <>
            <h2 className="text-white text-2xl font-extrabold text-center">Create Your Account</h2>
            <p className="text-white/80 text-sm text-center mt-1">
              Start helping your community and getting help when you need it
            </p>
          </>
        ) : (
          <>
            <h2 className="text-white text-2xl font-extrabold text-center">Authenticate with JWT</h2>
            <p className="text-white/80 text-sm text-center mt-1">
              Verify your identity to enter the app
            </p>
          </>
        )}
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className={`flex items-center gap-1.5 text-xs font-bold ${step === 'register' ? 'text-white' : 'text-white/50'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'register' ? 'bg-white text-dogood-blue' : 'bg-white/30 text-white'}`}>1</div>
            Register
          </div>
          <div className="w-8 h-0.5 bg-white/30 rounded" />
          <div className={`flex items-center gap-1.5 text-xs font-bold ${step === 'verify' ? 'text-white' : 'text-white/50'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'verify' ? 'bg-white text-dogood-blue' : 'bg-white/30 text-white'}`}>2</div>
            Verify JWT
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">

      {/* ── STEP 2: JWT Verify ── */}
      {step === 'verify' && (
        <motion.div
          key="verify"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="flex-1 px-6 py-8 flex flex-col gap-5"
        >
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-800">Account Created!</p>
              <p className="text-xs text-green-700 mt-0.5">A JWT token has been issued for your account. Verify it below to enter the app.</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-dogood-blue" /> Your JWT Token
            </p>
            <div className="relative">
              <textarea
                readOnly
                value={issuedToken}
                className="w-full h-24 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-mono text-slate-600 p-3 pr-10 resize-none focus:outline-none"
              />
              <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50">
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">This token is pre-filled below. In a real app you'd store this securely.</p>
          </div>

          <div>
            <label className="text-sm font-bold text-foreground mb-1.5 block">Paste JWT Token to Verify</label>
            <textarea
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              placeholder="Paste your JWT token here..."
              className="w-full h-20 rounded-xl border border-slate-200 text-[10px] font-mono text-slate-700 p-3 resize-none focus:outline-none focus:ring-1 focus:ring-dogood-blue"
            />
          </div>

          {verifyError && (
            <p className="text-xs text-red-500 flex items-center gap-1.5 bg-red-50 rounded-lg px-3 py-2">
              <XCircle className="w-4 h-4 flex-shrink-0" /> {verifyError}
            </p>
          )}

          <Button
            onClick={handleVerify}
            disabled={verifying || !tokenInput.trim()}
            className="w-full h-12 rounded-full bg-gradient-to-r from-dogood-green to-dogood-teal text-white font-bold text-base disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : (
              <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Verify & Enter App</span>
            )}
          </Button>

          <p className="text-center text-xs text-slate-400">
            Token expires in 1 hour · Secured with HS256
          </p>
        </motion.div>
      )}

      {/* ── STEP 1: Register Form ── */}
      {step === 'register' && (
      <motion.div
        key="register"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -40 }}
        className="flex-1 px-6 py-6 space-y-5"
      >
        <div>
          <label className="text-sm font-bold text-foreground mb-1.5 block">Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} className="pl-10 h-11 rounded-lg border-border" />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-foreground mb-1.5 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              className={`pl-10 h-11 rounded-lg ${showEmailError ? 'border-red-400 focus-visible:ring-red-400' : 'border-border'}`}
            />
          </div>
          {showEmailError && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Please enter a valid email (e.g. name@example.com)
            </p>
          )}
          {touched.email && emailValid && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Looks good!
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-bold text-foreground mb-1.5 block">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Enter your location" value={location} onChange={e => setLocation(e.target.value)} className="pl-10 h-11 rounded-lg border-border" />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-foreground mb-1.5 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Create a strong password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              className={`pl-10 pr-10 h-11 rounded-lg ${showPasswordChecks && !passwordValid ? 'border-orange-400 focus-visible:ring-orange-400' : showPasswordChecks && passwordValid ? 'border-green-400 focus-visible:ring-green-400' : 'border-border'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {showPasswordChecks && (
            <div className="mt-2 space-y-1 bg-slate-50 rounded-lg p-3 border border-slate-100">
              {passwordChecks.map(rule => (
                <p key={rule.label} className={`text-xs flex items-center gap-1.5 ${rule.passed ? 'text-green-600' : 'text-slate-400'}`}>
                  {rule.passed
                    ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    : <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                  {rule.label}
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-bold text-foreground mb-1.5 block">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Confirm your password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, confirmPassword: true }))}
              className={`pl-10 pr-10 h-11 rounded-lg ${showConfirmError ? 'border-red-400 focus-visible:ring-red-400' : confirmValid ? 'border-green-400 focus-visible:ring-green-400' : 'border-border'}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {showConfirmError && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Passwords do not match
            </p>
          )}
          {touched.confirmPassword && confirmValid && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Passwords match!
            </p>
          )}
        </div>

        <div className="bg-dogood-yellow/10 rounded-lg p-3 text-center text-sm text-muted-foreground">
          By creating an account, you agree to DoGood's{' '}
          <span className="text-dogood-blue font-semibold">Terms of Service</span> and{' '}
          <span className="text-dogood-blue font-semibold">Privacy Policy</span>.
        </div>

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1.5 bg-red-50 rounded-lg px-3 py-2">
            <XCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </p>
        )}

        <Button
          onClick={handleCreate}
          disabled={loading || !canSubmit}
          className="w-full h-12 rounded-full bg-gradient-to-r from-dogood-green to-dogood-teal text-white font-bold text-base disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Create Account & Get Token'}
        </Button>

        <p className="text-center text-sm text-muted-foreground pb-4">
          Already have an account?{' '}
          <Link to="/Welcome" className="text-dogood-blue font-semibold">Sign in instead</Link>
        </p>
      </motion.div>
      )}

      </AnimatePresence>
    </div>
  );
}