import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function AuthModal() {
  const { isAuthModalOpen, authMode, closeAuthModal, openLogin, openJoin, openForgot } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear fields when modal opens/closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setError(null);
      setResetSent(false);
      setSignupSuccess(false);
    }
  }, [isAuthModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (authMode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setResetSent(true);
      } else if (authMode === 'join') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        
        // If session is null, it means email confirmation is required
        if (!data.session) {
          setSignupSuccess(true);
        } else {
          closeAuthModal();
        }
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          throw error;
        }
        closeAuthModal();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-md overflow-hidden shadow-2xl rounded-xl"
          >
            <button 
              onClick={closeAuthModal}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-border/50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
                  {authMode === 'login' ? 'Welcome Back' : authMode === 'join' ? 'Join the Crew' : 'Reset Password'}
                </h2>
                <p className="text-muted text-sm font-medium uppercase tracking-widest">
                  {authMode === 'login' ? 'Sign in to your account' : authMode === 'join' ? 'Create your Marco Tac account' : 'Enter your email to reset'}
                </p>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start gap-3 text-sm font-medium">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              
              {resetSent ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Mail size={32} />
                  </div>
                  <p className="text-sm font-bold">We've sent a password reset link to <span className="text-primary">{email}</span>.</p>
                  <button onClick={openLogin} className="btn-primary w-full py-4">Back to Login</button>
                </div>
              ) : signupSuccess ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Check your email</h3>
                  <p className="text-sm font-medium text-muted">
                    We've sent a confirmation link to <span className="text-dark font-bold">{email}</span>. 
                    Please click the link to activate your account.
                  </p>
                  <button onClick={closeAuthModal} className="btn-primary w-full py-4">Got it</button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {authMode === 'join' && (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                      <input 
                        type="text" 
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-border pl-12 pr-4 py-4 focus:outline-none focus:border-primary transition-colors font-bold"
                        required
                      />
                    </div>
                  )}
                  
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-border pl-12 pr-4 py-4 focus:outline-none focus:border-primary transition-colors font-bold"
                      required
                    />
                  </div>
                  
                  {authMode !== 'forgot' && (
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-border pl-12 pr-12 py-4 focus:outline-none focus:border-primary transition-colors font-bold"
                        required
                        minLength={6}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  )}
                  
                  {authMode === 'login' && (
                    <div className="text-right">
                      <button type="button" onClick={openForgot} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                        Forgot Password?
                      </button>
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {authMode === 'login' ? 'Sign In' : authMode === 'join' ? 'Join Now' : 'Send Reset Link'} <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
              
              {!resetSent && !signupSuccess && (
                <div className="mt-8 pt-8 border-t border-border text-center">
                  <p className="text-xs text-muted font-bold uppercase tracking-widest mb-4">
                    {authMode === 'login' ? "Don't have an account?" : authMode === 'join' ? "Already have an account?" : "Remember your password?"}
                  </p>
                  <button 
                    onClick={authMode === 'login' ? openJoin : openLogin}
                    className="text-sm font-black uppercase tracking-widest text-dark hover:text-primary transition-colors"
                  >
                    {authMode === 'login' ? 'Create Account' : 'Sign In Instead'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
