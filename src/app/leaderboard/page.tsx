'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const getMedal = (rank: number) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Trophy className="w-6 h-6 text-slate-400" />;
  if (rank === 3) return <Trophy className="w-6 h-6 text-amber-700" />;
  return <span className="text-muted-foreground font-medium">{rank}</span>;
}

export default function LeaderboardPage() {
  const { firestore, user, isUserLoading: isAuthLoading } = useFirebase();

  const leaderboardQuery = useMemoFirebase(
    () => (firestore && user) ? query(collection(firestore, 'users'), orderBy('xp', 'desc'), limit(10)) : null,
    [firestore, user]
  );

  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useCollection<{username: string, xp: number, id: string}>(leaderboardQuery);

  const isLoading = isAuthLoading || isLeaderboardLoading;

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
            <TableCell className="text-center"><Skeleton className="h-6 w-6 rounded-full mx-auto" /></TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </TableCell>
            <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
        </TableRow>
      ));
    }

    if (!user) {
        return (
            <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    <p className="mb-4">Пожалуйста, войдите, чтобы увидеть таблицу лидеров.</p>
                    <Button asChild><Link href="/login">Войти</Link></Button>
                </TableCell>
            </TableRow>
        );
    }

    if (!leaderboardData || leaderboardData.length === 0) {
        return (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                В таблице лидеров пока пусто. Начните обучение, чтобы попасть сюда!
              </TableCell>
            </TableRow>
        );
    }
    
    return leaderboardData.map((entry, index) => (
        <TableRow key={entry.id} className="font-medium">
            <TableCell className="text-center">{getMedal(index + 1)}</TableCell>
            <TableCell>
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${entry.id}`} />
                <AvatarFallback>{entry.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{entry.username}</span>
            </div>
            </TableCell>
            <TableCell className="text-right text-lg">{entry.xp}</TableCell>
        </TableRow>
    ));
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Таблица лидеров
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">Ранг</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead className="text-right">Опыт (XP)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderContent()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
