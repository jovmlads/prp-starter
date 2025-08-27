import { ProfileFormData } from '@/types/profile';

const API_BASE = '/api';

function getAuthToken(): string {
  return localStorage.getItem('authToken') || '';
}

export const profileApi = {
  getProfile: async (): Promise<ProfileFormData> => {
    const response = await fetch(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  },

  updateProfile: async (data: ProfileFormData): Promise<ProfileFormData> => {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  },

  getVerifiedEmails: async () => {
    const response = await fetch(`${API_BASE}/profile/verified-emails`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  },

  checkUsername: async (username: string): Promise<{ available: boolean; suggestions?: string[] }> => {
    const response = await fetch(`${API_BASE}/profile/check-username`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return { available: result.available, suggestions: result.suggestions };
  }
};
