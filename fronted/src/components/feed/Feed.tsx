// components/feed/Feed.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Post as PostType } from '@/lib/data';
import { getPublicPosts, getUserById } from '@/lib/api';
import { Post } from './Post';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export function Feed() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const publicPosts = await getPublicPosts();
      
      // Fetch user data for each post. This is inefficient and should be improved in a real app (e.g., API includes user data).
      const postsWithUsers = await Promise.all(publicPosts.map(async (post) => {
          try {
              // The API doesn't provide user details with the post, so we fetch them separately.
              // In a real-world app, the backend should be optimized to include this.
              const user = await getUserById(post.user_id);
              return { ...post, user: { ...user, avatar: `https://placehold.co/100x100.png` } }; // adding placeholder avatar
          } catch (e) {
              console.error(`Failed to fetch user ${post.user_id}`, e);
          }
          return { ...post, user: { name: 'Unknown User', title: 'Unknown Title', avatar: 'https://placehold.co/100x100.png' } };
      }));

      setPosts(postsWithUsers);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to load feed',
        description: error.message || 'Could not fetch posts from the server.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg bg-card">
            <div className="flex items-center space-x-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
