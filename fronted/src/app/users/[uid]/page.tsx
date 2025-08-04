// src/app/users/[uid]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { getUserById } from '@/lib/api';
import type { User } from '@/lib/data';

// Using mock experience/skills for now, as API doesn't provide this.
const mockData = {
    experience: [
    { id: 1, title: 'Lead Developer', company: 'Innovate LLC', duration: '2020 - Present', description: 'Leading a team of developers to build next-gen applications.'},
    { id: 2, title: 'Frontend Developer', company: 'WebFlow Inc.', duration: '2018 - 2020', description: 'Developed and maintained responsive user interfaces.'},
  ],
  skills: ['JavaScript', 'React', 'Vue.js', 'Node.js', 'UI/UX Design'],
}

export default function UserProfilePage() {
    const { token } = useAuth();
    const router = useRouter();
    const params = useParams();
    const uid = params.uid as string;
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        if (uid) {
            getUserById(uid)
                .then(data => setUser(data))
                .catch(err => {
                    console.error(err);
                    // redirect to a 404 or show an error message
                    router.push('/not-found');
                })
                .finally(() => setLoading(false));
        }
    }, [uid, token, router]);

    if (loading || !user) {
        return (
             <div className="bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Simplified skeleton for user profile page */}
                    <Skeleton className="h-48 w-full mb-8" />
                    <Skeleton className="h-32 w-full mb-8" />
                    <Skeleton className="h-64 w-full" />
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
              <div className="h-32 bg-primary" />
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
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{user.bio || 'No bio available.'}</p>
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
                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="company logo"/>
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
              <CardContent>
                 <div className="flex justify-between items-center">
                    <span className="font-semibold text-muted-foreground">Profile Views</span>
                    <span className="font-bold text-primary">{user.profile_views || 0}</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
