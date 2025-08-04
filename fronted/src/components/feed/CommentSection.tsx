// src/components/feed/CommentSection.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { addComment, getCommentsForPost, getUserById, incrementProfileView } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import type { Comment as CommentType } from '@/lib/data';
import Link from 'next/link';

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedComments = await getCommentsForPost(postId);
      const commentsWithUsers = await Promise.all(
        fetchedComments.map(async (comment) => {
          try {
            const commentUser = await getUserById(comment.user_id);
            return { ...comment, user: { ...commentUser, avatar: 'https://placehold.co/100x100.png' } };
          } catch (e) {
            console.error(`Failed to fetch user ${comment.user_id} for comment ${comment.id}`, e);
            return { ...comment, user: { name: 'Unknown User', title: 'Unknown Title', avatar: 'https://placehold.co/100x100.png' } };
          }
        })
      );
      setComments(commentsWithUsers);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error loading comments',
        description: 'Could not fetch comments for this post.',
      });
    } finally {
      setLoading(false);
    }
  }, [postId, toast]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    setPosting(true);
    try {
      await addComment({ post_id: postId, comment_text: newComment });
      setNewComment('');
      toast({ title: 'Comment posted!' });
      // Refetch comments to show the new one
      await fetchComments();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to post comment',
        description: 'Please try again.',
      });
    } finally {
      setPosting(false);
    }
  };
  
  const handleProfileView = (uid: string) => {
    incrementProfileView(uid).catch(console.error);
  };

  return (
    <div className="border-t p-4">
      {user && (
        <div className="flex items-start space-x-3 mb-4">
            <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
            <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
            />
            <Button onClick={handleAddComment} disabled={posting || !newComment.trim()}>
                {posting ? 'Posting...' : 'Post'}
            </Button>
            </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <>
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
             <div className="flex space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user?.avatar} alt={comment.user?.name} />
                <AvatarFallback>{comment.user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted p-3 rounded-lg">
                <div className="flex items-center justify-between">
                   <Link href={`/users/${comment.user_id}`} className="font-semibold hover:underline text-sm" onClick={() => handleProfileView(comment.user_id)}>
                    {comment.user?.name || 'Anonymous'}
                    </Link>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                 <p className="text-sm text-muted-foreground">{comment.user?.title}</p>
                <p className="text-sm mt-1">{comment.comment_text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
