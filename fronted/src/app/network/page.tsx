// src/app/network/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ConnectionSuggestions } from "@/components/network/ConnectionSuggestions";
import { Invitations } from "@/components/network/Invitations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { currentUser } from '@/lib/data'; // Using mock data for now

export default function NetworkPage() {
    const { user, loading, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !token) {
            router.push('/login');
        }
    }, [user, loading, token, router]);

    if (loading || !user) {
        return (
            <div className="bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <Skeleton className="h-48 w-full" />
                        </div>
                        <div className="md:col-span-2 space-y-8">
                             <Skeleton className="h-48 w-full" />
                             <Skeleton className="h-96 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
             <Card>
              <CardHeader>
                <CardTitle>Manage my network</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Dummy links for now */}
                <ul className="space-y-2">
                  <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted-foreground/10 cursor-pointer"><span>Connections</span><span className="text-muted-foreground">1,234</span></li>
                  <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted-foreground/10 cursor-pointer"><span>Contacts</span><span className="text-muted-foreground">2,500</span></li>
                  <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted-foreground/10 cursor-pointer"><span>People I Follow</span><span className="text-muted-foreground">89</span></li>
                   <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted-foreground/10 cursor-pointer"><span>Groups</span><span className="text-muted-foreground">15</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Invitations />
            <ConnectionSuggestions
              userProfile={JSON.stringify({
                skills: currentUser.skills,
                experience: currentUser.experience,
                industry: "Technology",
              })}
              userActivity={JSON.stringify({
                posts: ["Discussed Next.js server components"],
                shared: ["Article on UX Design principles"],
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
