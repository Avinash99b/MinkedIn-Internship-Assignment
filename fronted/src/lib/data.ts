export type User = {
  uid: string;
  name: string;
  email: string;
  bio?: string;
  desired_field?: string;
  title?: string; // Not in API spec, but used in UI
  avatar?: string; // Not in API spec, but used in UI
  profile_views?: number;
  created_at?: string;
  updated_at?: string;
};

export type Experience = {
  id: number;
  title:string;
  company: string;
  duration: string;
  description: string;
};

export type PostData = {
  text: string;
  image_urls?: string[];
};

export type Post = {
  id: number;
  user_id: string;
  post_data: PostData;
  field: string;
  visibility: 'public' | 'private';
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  user?: User; // To hold fetched user details
  comments?: Comment[];
};


export type Comment = {
  id: number;
  post_id: number;
  user_id: string;
  comment_text: string;
  created_at: string;
  updated_at: string;
  user?: User; // To hold fetched user details
};


export const currentUser: User = {
  uid: '1',
  name: 'Alex Johnson',
  title: 'Senior Software Engineer at TechCorp',
  avatar: 'https://placehold.co/100x100.png',
  email: 'alex@example.com',
};

export const suggestions = [
  { id: 1, name: 'Tech Innovations Inc.', title: 'Company · Technology', avatar: 'https://placehold.co/40x40.png', 'data-ai-hint': 'logo technology' },
  { id: 2, name: 'Design Hub', title: 'Community · Design', avatar: 'https://placehold.co/40x40.png', 'data-ai-hint': 'logo design' },
  { id: 3, name: 'Marketing Masters', title: 'Group · Marketing', avatar: 'https://placehold.co/40x40.png', 'data-ai-hint': 'logo marketing' },
];

export const invitations = [
    { id: 1, user: { name: 'David Chen', title: 'UX/UI Designer at CreativeMinds', avatar: 'https://placehold.co/100x100.png' } },
    { id: 2, user: { name: 'Maria Garcia', title: 'Data Scientist at DataDriven Inc.', avatar: 'https://placehold.co/100x100.png' } },
];
