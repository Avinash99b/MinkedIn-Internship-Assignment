'use client';
import {
  Briefcase,
  Home,
  MessageSquare,
  Network,
  Bell,
  Search,
  Users,
  ChevronDown,
  Menu,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/network', icon: Users, label: 'My Network' },
  { href: '/jobs', icon: Briefcase, label: 'Jobs' },
  { href: '/messaging', icon: MessageSquare, label: 'Messaging' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
];

const NavItem = ({
  href,
  icon: Icon,
  label,
  isMobile = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isMobile?: boolean;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (isMobile) {
    return (
       <Link
        href={href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
          isActive && 'bg-muted text-primary'
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'hidden md:flex flex-col items-center justify-center h-full w-20 text-muted-foreground hover:text-foreground transition-colors',
        isActive && 'text-foreground border-b-2 border-foreground'
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs">{label}</span>
    </Link>
  );
};

export function Header() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const currentUser = user;


  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation links for the ProLink application.
                </SheetDescription>
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <Network className="h-6 w-6 text-primary" />
                    <span >MinkedIn</span>
                  </Link>
                  {navItems.map((item) => <NavItem key={item.href} {...item} isMobile={true} />)}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center space-x-2">
              <Network className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl hidden sm:inline">MinkedIn</span>
            </Link>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-10 w-full sm:w-64 bg-background"
              />
            </div>
          </div>
          <div className="flex items-center h-full">
            {currentUser ? (
              <>
                <nav className="hidden md:flex items-center h-full">
                  {navItems.map((item) => (
                    <NavItem key={item.href} {...item} />
                  ))}
                </nav>
                <div className="h-full border-l mx-2 md:mx-4" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors w-12 md:w-20">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback>{currentUser.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex items-center text-xs">
                        <span>Me</span>
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex items-center space-x-2">
                         <Avatar className="h-10 w-10">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback>{currentUser.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold">{currentUser.name}</div>
                          <div className="text-xs text-muted-foreground font-normal">{currentUser.title}</div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">View Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Settings & Privacy</DropdownMenuItem>
                    <DropdownMenuItem>Help</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
                <Button asChild>
                    <Link href="/login"><LogIn className="mr-2"/> Login</Link>
                </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
