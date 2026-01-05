/// <reference types="vite/client" />

// MongoDB API client for admin panel
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || '';

export interface Admin {
    id: string;
    email: string;
    created_at: string;
}

export interface User {
    _id: string;
    id: string; // Alias for _id
    username: string;
    email: string;
    fullName: string;
    profilePicture: string;
    bio?: string;
    pollCount?: number;
    reportCount?: number;
    followersCount?: number;
    followingCount?: number;
    createdAt: string;
}

export interface Poll {
    _id: string;
    question: string;
    options: Array<{
        text: string;
        emoji?: string;
        voteCount: number;
    }>;
    userId: {
        _id: string;
        username: string;
        email: string;
        profilePicture: string;
    };
    totalVotes: number;
    createdAt: string;
}

export interface ReportedPoll {
    _id: string;
    pollId: Poll;
    reportedBy: User;
    reason: string;
    status: string;
    createdAt: string;
}

export interface ReportedUser {
    _id: string;
    reported_user_id: string;
    reported_by: string;
    reason: string;
    created_at: string;
    status: string;
    reported_user?: User;
    reporter?: User;
}

// API Helper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'x-admin-token': ADMIN_TOKEN,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }

    return response.json();
};

// Poll Reports API
export const pollReportsAPI = {
    // Get all reported polls
    getAll: async (): Promise<{ success: boolean; count: number; reports: ReportedPoll[] }> => {
        return apiCall('/polls/reports/all');
    },

    // Get all polls (admin)
    getAllPolls: async (): Promise<{ success: boolean; count: number; polls: any[] }> => {
        return apiCall('/polls/admin/all');
    },

    // Delete a poll by ID (admin)
    deletePollById: async (pollId: string): Promise<{ success: boolean; message: string }> => {
        return apiCall(`/polls/admin/${pollId}`, {
            method: 'DELETE',
        });
    },

    // Delete a poll (from report)
    deletePoll: async (reportId: string): Promise<{ success: boolean; message: string }> => {
        return apiCall(`/polls/reports/${reportId}`, {
            method: 'DELETE',
        });
    },

    // Dismiss a report
    dismissReport: async (reportId: string): Promise<{ success: boolean; message: string }> => {
        return apiCall(`/polls/reports/${reportId}/dismiss`, {
            method: 'PUT',
        });
    },
};

// User API
export const userAPI = {
    // Get all users (admin)
    getAll: async (): Promise<{ success: boolean; count: number; users: User[] }> => {
        return apiCall('/users/admin/all');
    },

    // Get user's polls (admin)
    getUserPolls: async (userId: string): Promise<{ success: boolean; count: number; polls: any[] }> => {
        return apiCall(`/users/admin/${userId}/polls`);
    },

    // Get user's reports (admin)
    getUserReports: async (userId: string): Promise<{ success: boolean; count: number; reports: ReportedPoll[] }> => {
        return apiCall(`/users/admin/${userId}/reports`);
    },

    // Delete a user (admin)
    deleteUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
        return apiCall(`/users/${userId}/admin`, {
            method: 'DELETE',
        });
    },
};

// Admin Authentication (Simple check)
export const adminAuth = {
    isAuthenticated: (): boolean => {
        return !!ADMIN_TOKEN && ADMIN_TOKEN.length > 0;
    },

    getToken: (): string => {
        return ADMIN_TOKEN;
    },
};
