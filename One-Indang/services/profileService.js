import { db, auth } from './supabase';

// Profile service functions
export const profileService = {
  // Get current user profile
  getCurrentProfile: async () => {
    const { user } = await auth.getCurrentUser();
    if (!user) return { data: null, error: 'No user logged in' };

    return await db.select('profiles', '*', { id: user.id });
  },

  // Update user profile
  updateProfile: async (updates) => {
    const { user } = await auth.getCurrentUser();
    if (!user) return { error: 'No user logged in' };

    return await db.update('profiles', {
      ...updates,
      updated_at: new Date().toISOString()
    }, { id: user.id });
  },

  // Create profile (usually handled by trigger, but manual fallback)
  createProfile: async (profileData) => {
    const { user } = await auth.getCurrentUser();
    if (!user) return { error: 'No user logged in' };

    return await db.insert('profiles', {
      id: user.id,
      ...profileData
    });
  }
};

// Example usage in a component:
/*
import { profileService } from '../services/profileService';

const loadProfile = async () => {
  const { data, error } = await profileService.getCurrentProfile();
  if (error) {
    console.error('Error loading profile:', error);
  } else {
    setProfile(data[0]);
  }
};

const updateProfile = async (updates) => {
  const { error } = await profileService.updateProfile(updates);
  if (error) {
    console.error('Error updating profile:', error);
  } else {
    showToast('Profile updated successfully!');
  }
};
*/