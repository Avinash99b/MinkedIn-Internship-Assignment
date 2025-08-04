import type { Post as PostType } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ThumbsUp, MessageSquare, Repeat, Send } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { CommentSection } from './CommentSection';
import { incrementProfileView } from '@/lib/api';

interface PostProps {
  post: PostType;
}

export function Post({ post }: PostProps) {
    const timeAgo = post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : 'Just now';
    const [showComments, setShowComments] = useState(false);

    const handleProfileView = () => {
      incrementProfileView(post.user_id).catch(console.error);
    };

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.user?.avatar} alt={post.user?.name} />
            <AvatarFallback>{post.user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/users/${post.user_id}`} className="font-semibold hover:underline" onClick={handleProfileView}>
              {post.user?.name || 'Anonymous User'}
            </Link>
            <p className="text-xs text-muted-foreground">{post.user?.title}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="text-sm">{post.post_data.text}</p>
        {post.post_data.image_urls?.[0] && (
            <img src={post.post_data.image_urls[0]} alt="Post content" className="mt-4 rounded-lg w-full" />
        )}
      </CardContent>
       <CardFooter className="flex flex-col items-start p-4 pt-2">
        <div className="flex justify-between w-full text-xs text-muted-foreground mb-2">
            <div>{post.likes_count} Likes</div>
            <div>{post.comments_count} Comments</div>
        </div>
        <div className="border-t w-full pt-2 flex justify-around">
          <Button variant="ghost" className="w-full">
            <ThumbsUp className="mr-2 h-5 w-5" /> Like
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setShowComments(!showComments)}>
            <MessageSquare className="mr-2 h-5 w-5" /> Comment
          </Button>
          <Button variant="ghost" className="w-full">
            <Repeat className="mr-2 h-5 w-5" /> Repost
          </Button>
          <Button variant="ghost" className="w-full">
            <Send className="mr-2 h-5 w-5" /> Send
          </Button>
        </div>
      </CardFooter>
      {showComments && <CommentSection postId={post.id} />}
    </Card>
  );
}
