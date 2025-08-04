
'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { createPost } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Image, Video, Calendar, AlignLeft } from 'lucide-react';
import React from 'react';

export function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [postContent, setPostContent] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Post cannot be empty',
      });
      return;
    }
    setLoading(true);
    try {
      await createPost({
        post_data: { text: postContent },
        field: user?.desired_field || 'general',
        visibility: 'public',
      });
      toast({
        title: 'Post created successfully!',
      });
      setPostContent('');
      setOpen(false);
      onPostCreated();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to create post',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <DialogTrigger asChild>
          <div
            className="flex-1 cursor-pointer rounded-full border bg-background hover:bg-muted px-4 py-2 text-left text-muted-foreground text-sm sm:text-base"
          >
            Start a post
          </div>
          </DialogTrigger>
        </div>
        <div className="flex justify-around items-center mt-3 pt-2 border-t">
            <Button variant="ghost" size="sm" className="text-muted-foreground flex-1">
              <Image className="mr-0 sm:mr-2 h-5 w-5 text-primary" />
              <span className="hidden sm:inline">Photo</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground flex-1">
              <Video className="mr-0 sm:mr-2 h-5 w-5 text-green-500" />
              <span className="hidden sm:inline">Video</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground flex-1">
              <Calendar className="mr-0 sm:mr-2 h-5 w-5 text-orange-500" />
              <span className="hidden sm:inline">Event</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground flex-1">
              <AlignLeft className="mr-0 sm:mr-2 h-5 w-5 text-red-500" />
              <span className="hidden sm:inline">Article</span>
            </Button>
        </div>
      </CardContent>
    </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-3">
            <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">Post to anyone</p>
            </div>
        </div>
        <Textarea
          placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
          className="min-h-[150px] border-none focus-visible:ring-0 shadow-none resize-none text-base"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <DialogFooter className="justify-between">
            <div className="flex items-center space-x-2">
                 <Button variant="ghost" size="icon"><Image className="h-5 w-5" /></Button>
                 <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
                 <Button variant="ghost" size="icon"><Calendar className="h-5 w-5" /></Button>
            </div>
          <Button onClick={handlePostSubmit} disabled={loading}>{loading ? 'Posting...' : 'Post'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
