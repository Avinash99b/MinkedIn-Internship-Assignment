// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CreatePost } from "@/components/feed/CreatePost";
import { Feed } from "@/components/feed/Feed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { suggestions } from "@/lib/data";
import { Plus } from "lucide-react";
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user, loading } = useAuth();
  const [feedKey, setFeedKey] = useState(0);

  const handlePostCreated = () => {
    setFeedKey(prevKey => prevKey + 1);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Skeleton className="w-24 h-24 mx-auto rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardContent>
            </Card>
          </aside>
          <main className="lg:col-span-2 space-y-6">
             <Skeleton className="h-32 w-full" />
             <Skeleton className="h-48 w-full" />
             <Skeleton className="h-48 w-full" />
          </main>
           <aside className="lg:col-span-1">
              <Skeleton className="h-64 w-full" />
           </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <aside className="lg:col-span-1">
          {user ? (
            <Card className="overflow-hidden text-center">
              <div className="h-20 bg-primary" />
              <CardContent className="pt-0">
                <Link href="/profile">
                  <Avatar className="w-24 h-24 mx-auto -mt-12 border-4 border-card rounded-full">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <h2 className="text-xl font-bold mt-4">
                  <Link href="/profile" className="hover:underline">{user?.name}</Link>
                </h2>
                <p className="text-muted-foreground text-sm">{user?.title}</p>
                <div className="mt-4 border-t pt-4 text-sm text-left">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground font-semibold">Connections</span>
                    <span className="text-primary font-bold">1,234</span>
                  </div>
                   <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground font-semibold">Profile Views</span>
                    <span className="text-primary font-bold">{user.profile_views || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
             <Card>
                <CardHeader>
                    <CardContent>
                        <h2 className="text-xl font-bold">Welcome to MinkedIn</h2>
                        <p className="text-muted-foreground">Join the community to connect with professionals.</p>
                        <div className="mt-4 flex flex-col space-y-2">
                             <Button asChild><Link href="/login">Login</Link></Button>
                             <Button variant="outline" asChild><Link href="/register">Register</Link></Button>
                        </div>
                    </CardContent>
                </CardHeader>
             </Card>
          )}
        </aside>

        <main className="lg:col-span-2 space-y-6">
          {user && <CreatePost onPostCreated={handlePostCreated} />}
          <Feed key={feedKey} />
        </main>

        <aside className="lg:col-span-1">
          <Card className='overflow-hidden'>
            <CardHeader>
              <h3 className="font-bold">Add to your feed</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-start space-x-3">
                  <Avatar className="flex-shrink-0">
                    <AvatarImage src={suggestion.avatar} alt={suggestion.name} data-ai-hint={suggestion['data-ai-hint']} />
                    <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{suggestion.name}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.title}</p>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0">
                    <Plus className="mr-1 h-4 w-4" />
                    Follow
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
