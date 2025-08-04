import { Post, User, Comment } from "./data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://minkedin-internship-assignment.onrender.com';

async function request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorBody.message || 'An error occurred with the API request.');
    }

    if (res.status === 204) {
        return;
    }

    return res.json();
}

export const getPublicPosts = (): Promise<Post[]> => {
    return request('/posts/public');
}

export const createPost = (postData: { post_data: { text: string }, field: string, visibility: 'public' | 'private' }): Promise<Post> => {
    return request('/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
    });
}

export const getUserById = (uid: string): Promise<User> => {
    return request(`/users/${uid}`);
}

export const getCurrentUser = (): Promise<User> => {
    return request('/users/me');
}

export const addComment = (commentData: { post_id: number; comment_text: string }): Promise<Comment> => {
    return request('/comments', {
        method: 'POST',
        body: JSON.stringify(commentData),
    });
}

export const getCommentsForPost = (postId: number): Promise<Comment[]> => {
    return request(`/comments/posts/${postId}/comments`);
}

export const incrementProfileView = (uid: string): Promise<{ profile_views: number }> => {
    return request(`/users/${uid}/view`, {
        method: 'POST'
    });
}

export const updateUserBio = (bio: string): Promise<User> => {
    return request('/users/me/bio', {
        method: 'PATCH',
        body: JSON.stringify({ bio }),
    });
}
