'use client';

import { useState } from 'react';
import { suggestedConnections } from '@/ai/flows/suggested-connections';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

interface ConnectionSuggestionsProps {
  userProfile: string;
  userActivity: string;
}

export function ConnectionSuggestions({ userProfile, userActivity }: ConnectionSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestedConnections({
        userProfile,
        userActivity,
        numberOfSuggestions: 6,
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      // Here you might want to use a toast notification to show an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Connection Suggestions</CardTitle>
        <CardDescription>
          Discover new connections based on your profile and activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 && !loading && (
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">Click the button to generate personalized suggestions.</p>
            <Button onClick={handleGenerate}>Generate Suggestions</Button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-24 rounded-full mt-2" />
              </div>
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((name, i) => (
                <Card key={i} className="text-center p-4 flex flex-col items-center">
                   <Avatar className="w-20 h-20 mb-4">
                     <AvatarImage src={`https://placehold.co/80x80.png`} data-ai-hint="person portrait" />
                     <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                   </Avatar>
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground mb-4">Engineer at Tech Startup</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-1 h-4 w-4" />
                    Connect
                  </Button>
                </Card>
              ))}
            </div>
             <div className="text-center mt-6">
                <Button onClick={handleGenerate} disabled={loading}>
                  {loading ? "Generating..." : "Generate New Suggestions"}
                </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
