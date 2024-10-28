import { useState, useEffect } from 'react';
import { userService, User } from '../services/userService';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUserRoleChange(userId: string, role: 'moderator' | 'user') {
    try {
      await userService.updateUserRole(userId, role);
      await loadUsers();
    } catch (err) {
      setError(err as Error);
    }
  }

  async function handleUserStatusChange(userId: string, status: 'active' | 'suspended') {
    try {
      await userService.updateUserStatus(userId, status);
      await loadUsers();
    } catch (err) {
      setError(err as Error);
    }
  }

  async function handleUserDelete(userId: string) {
    try {
      await userService.deleteUser(userId);
      await loadUsers();
    } catch (err) {
      setError(err as Error);
    }
  }

  return {
    users,
    loading,
    error,
    handleUserRoleChange,
    handleUserStatusChange,
    handleUserDelete,
  };
}