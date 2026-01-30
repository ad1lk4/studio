'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon, Star, BookOpen } from 'lucide-react';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isProfileLoading || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${userProfile.id}`} />
            <AvatarFallback>
                {userProfile.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-3xl">{userProfile.username}</CardTitle>
            <p className="text-muted-foreground">{userProfile.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className='flex items-center gap-3'>
                    <Star className="w-6 h-6 text-yellow-500" />
                    <span className="font-bold">Опыт (XP)</span>
                </div>
                <span className="text-xl font-bold">{userProfile.xp}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className='flex items-center gap-3'>
                    <BookOpen className="w-6 h-6 text-primary" />
                    <span className="font-bold">Уроков пройдено</span>
                </div>
                <span className="text-xl font-bold">{userProfile.completedLessons?.length || 0}</span>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    