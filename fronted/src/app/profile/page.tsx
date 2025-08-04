// src/app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pen, Save } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { currentUser as mockData } from '@/lib/data'; // keeping mock experience/skills for now
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateUserBio } from '@/lib/api';

export default function ProfilePage() {
    const { user, loading, token, fetchUser } = useAuth();
    const router = useRouter();
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bio, setBio] = useState(user?.bio || '');
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!loading && !token) {
        router.push('/login');
        }
    }, [user, loading, token, router]);
    
    useEffect(() => {
        if (user) {
            setBio(user.bio || '');
        }
    }, [user]);

     const handleSaveBio = async () => {
        setIsSaving(true);
        try {
            await updateUserBio(bio);
            await fetchUser(); // Refetch user data to get the latest profile
            toast({ title: "Bio updated successfully!" });
            setIsEditingBio(false);
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Failed to update bio", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };


    if (loading || !user) {
        return (
             <div className="bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <main className="lg:col-span-2 space-y-8">
                        <Card className="overflow-hidden">
                            <Skeleton className="h-32 w-full" />
                            <CardContent className="pt-0 relative">
                                 <Skeleton className="w-32 h-32 mx-4 -mt-16 border-4 border-card rounded-full" />
                                <div className="p-4 pt-2">
                                    <Skeleton className="h-8 w-1/2 mb-2" />
                                    <Skeleton className="h-4 w-1/3 mb-2" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>About</CardTitle></CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Experience</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                               <Skeleton className="h-24 w-full" />
                               <Skeleton className="h-24 w-full" />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                               <Skeleton className="h-8 w-full" />
                            </CardContent>
                        </Card>
                    </main>
                    <aside className="lg:col-span-1 space-y-8">
                        <Skeleton className="h-48 w-full" />
                    </aside>
                    </div>
                </div>
            </div>
        )
    }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden">
              <div className="h-32 bg-primary relative" />
              <CardContent className="pt-0 relative">
                <Avatar className="w-32 h-32 mx-4 -mt-16 border-4 border-card rounded-full">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="p-4 pt-2">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.title}</p>
                   <p className="text-sm text-muted-foreground mt-1">
                    {user.email}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <Button>Connect</Button>
                    <Button variant="outline">Message</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>About</CardTitle>
                 <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => setIsEditingBio(!isEditingBio)}>
                  <Pen className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {isEditingBio ? (
                  <div className='space-y-4'>
                    <Textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px]"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" onClick={() => setIsEditingBio(false)}>Cancel</Button>
                      <Button onClick={handleSaveBio} disabled={isSaving}>
                        {isSaving ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save</>}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{user.bio || 'No bio available. Click the edit button to add one!'}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockData.experience?.map((exp) => (
                  <div key={exp.id} className="flex space-x-4">
                    <Avatar className="mt-1">
                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="company logo" />
                        <AvatarFallback>{exp.company.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{exp.title}</h4>
                      <p className="text-sm">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.duration}</p>
                      <p className="text-sm mt-2">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {mockData.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-base font-medium py-1 px-3">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </main>
          <aside className="lg:col-span-1 space-y-8">
             <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                 <div className="flex justify-between items-center">
                    <span className="font-semibold text-muted-foreground">Profile Views</span>
                    <span className="font-bold text-primary">{user.profile_views || 0}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="font-semibold text-muted-foreground">Post Views</span>
                    <span className="font-bold text-primary">1,234</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>People you may know</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Placeholder for more suggestions */}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
