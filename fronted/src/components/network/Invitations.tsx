import { invitations } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import Link from "next/link";

export function Invitations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={invite.user.avatar} alt={invite.user.name} />
                  <AvatarFallback>{invite.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href="#" className="font-semibold hover:underline">
                    {invite.user.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{invite.user.title}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Ignore</span>
                </Button>
                <Button variant="default" size="icon">
                  <Check className="h-4 w-4" />
                   <span className="sr-only">Accept</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
