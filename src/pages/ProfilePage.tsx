import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { User, Mail, Star, LogOut, Package, Settings, Edit2, Camera, Key, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ProfilePage() {
  const { user, logout, updateUserContext } = useAuth();
  
  // Name Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isSavingName, setIsSavingName] = useState(false);

  // Profile Picture State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleSaveName = async () => {
    if (!newName.trim() || newName === user.name) {
      setIsEditingName(false);
      return;
    }
    
    setIsSavingName(true);
    try {
      if (user.id !== 'admin-bypass-id') {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: newName }
        });
        if (error) throw error;
      }
      updateUserContext({ name: newName });
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name. Please try again.');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('imageFile', file);

      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { imageUrl } = await response.json();

      if (user.id !== 'admin-bypass-id') {
        const { error } = await supabase.auth.updateUser({
          data: { avatar_url: imageUrl }
        });
        if (error) throw error;
      }
      
      updateUserContext({ avatar_url: imageUrl });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsSavingPassword(true);
    try {
      if (user.id !== 'admin-bypass-id') {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) throw error;
      }
      
      setPasswordSuccess(true);
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordSuccess(false);
      }, 2000);
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-[80vh] bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="bg-dark text-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shrink-0 overflow-hidden border-4 border-dark">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <Camera size={24} className="text-white" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="text-center md:text-left flex-1 min-w-0">
              <h1 className="text-3xl font-black uppercase tracking-tight mb-2 break-words">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/70">
                <Mail size={16} className="shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
            <div className="bg-white/10 px-6 py-4 rounded-xl text-center">
              <div className="text-sm font-bold uppercase tracking-widest text-primary mb-1">Marco Points</div>
              <div className="text-3xl font-black flex items-center justify-center gap-2">
                <Star size={24} className="fill-primary text-primary" />
                {user.points || 0}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-2">
              <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold bg-primary/10 text-primary">
                <User size={20} />
                My Profile
              </div>
              <Link 
                to="/profile/orders"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors hover:bg-border/50 text-muted hover:text-dark"
              >
                <Package size={20} />
                Order History
              </Link>
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-border/50 rounded-lg font-bold transition-colors text-muted hover:text-dark"
              >
                <Key size={20} />
                Change Password
              </button>
              <div className="pt-4 mt-4 border-t border-border">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 rounded-lg font-bold transition-colors"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
                  <h2 className="text-xl font-black uppercase tracking-tight mb-6">Account Details</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-muted uppercase tracking-widest">Full Name</label>
                        {!isEditingName && (
                          <button 
                            onClick={() => setIsEditingName(true)}
                            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                        )}
                      </div>
                      {isEditingName ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)}
                            className="flex-1 p-3 bg-background border border-border rounded-lg font-medium focus:outline-none focus:border-primary min-w-0"
                            autoFocus
                          />
                          <button 
                            onClick={handleSaveName}
                            disabled={isSavingName}
                            className="px-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 shrink-0"
                          >
                            {isSavingName ? 'Saving...' : 'Save'}
                          </button>
                          <button 
                            onClick={() => {
                              setIsEditingName(false);
                              setNewName(user.name);
                            }}
                            disabled={isSavingName}
                            className="px-4 py-3 bg-border text-dark font-bold rounded-lg hover:bg-border/80 transition-colors disabled:opacity-50 shrink-0"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 bg-background border border-border rounded-lg font-medium break-words">
                          {user.name}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Email Address</label>
                      <div className="p-4 bg-background border border-border rounded-lg font-medium text-muted break-all">
                        {user.email}
                      </div>
                    </div>

                    {user.isAdmin && (
                      <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl mt-8">
                        <h3 className="font-black uppercase tracking-tight text-primary mb-2">Admin Status</h3>
                        <p className="text-sm font-medium mb-4">You have administrator privileges for this store.</p>
                        <a href="/admin" className="btn-primary inline-block">Go to Admin Dashboard</a>
                      </div>
                    )}
                  </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Change Password</h3>
                  <button 
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="p-2 hover:bg-border/50 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {passwordSuccess ? (
                  <div className="p-4 bg-green-50 text-green-600 rounded-lg text-center font-bold">
                    Password updated successfully!
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {passwordError && (
                      <div className="p-3 bg-red-50 text-red-500 text-sm font-bold rounded-lg">
                        {passwordError}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        required
                        minLength={6}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSavingPassword}
                      className="w-full btn-primary py-4 mt-4"
                    >
                      {isSavingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
