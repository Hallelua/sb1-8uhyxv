import { supabase } from '../config/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'suspended';
  createdAt: string;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateUserRole(userId: string, role: 'moderator' | 'user'): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
  },

  async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', userId);

    if (error) throw error;
  },

  async deleteUser(userId: string): Promise<void> {
    // First, delete all user's submissions
    await supabase
      .from('submissions')
      .delete()
      .eq('user_id', userId);

    // Then delete the user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  }
};