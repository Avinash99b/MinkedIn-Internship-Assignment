// src/app/not-found.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background text-foreground text-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Frown className="h-24 w-24 mx-auto text-primary" />
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
          404 - Page Not Found
        </h1>
        <p className="mt-4 max-w-md mx-auto text-lg text-muted-foreground">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        className="mt-10"
      >
        <Button asChild size="lg">
          <Link href="/">
            Go back to Homepage
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
