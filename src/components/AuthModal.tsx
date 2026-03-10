import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, authMode, closeAuthModal, login, openLogin, openJoin, openForgot } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'forgot') {
      setResetSent(true);
      return;
    }

    // Check for admin credentials
    const isAdmin = email === 'gucciwebsite20@gmail.com' && password === 'Gucci20website$';
    
    if (isAdmin) {
      login(email, 'Admin User', true);
    } else {
      // Simulate regular auth
      login(email, name || 'Tacoma Enthusiast', false);
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
              
              {resetSent ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Mail size={32} />
                  </div>
                  <p className="text-sm font-bold">We've sent a password reset link to <span className="text-primary">{email}</span>.</p>
                  <button onClick={openLogin} className="btn-primary w-full py-4">Back to Login</button>
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
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-border pl-12 pr-4 py-4 focus:outline-none focus:border-primary transition-colors font-bold"
                        required
                      />
                    </div>
                  )}
                  
                  {authMode === 'login' && (
                    <div className="text-right">
                      <button type="button" onClick={openForgot} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                        Forgot Password?
                      </button>
                    </div>
                  )}
                  
                  <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-3">
                    {authMode === 'login' ? 'Sign In' : authMode === 'join' ? 'Join Now' : 'Send Reset Link'} <ArrowRight size={18} />
                  </button>
                </form>
              )}
              
              {!resetSent && (
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
