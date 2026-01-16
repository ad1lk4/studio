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

const leaderboardData = [
  { rank: 1, user: "Айсулу", xp: 1520, avatar: "A" },
  { rank: 2, user: "Бекзат", xp: 1480, avatar: "Б" },
  { rank: 3, user: "Гаухар", xp: 1350, avatar: "Г" },
  { rank: 4, user: "Данияр", xp: 1200, avatar: "Д" },
  { rank: 5, user: "Ермек", xp: 1150, avatar: "Е" },
  { rank: 6, user: "Жанар", xp: 1090, avatar: "Ж" },
  { rank: 7, user: "Зере", xp: 980, avatar: "З" },
  { rank: 8, user: "Кайрат", xp: 850, avatar: "К" },
  { rank: 9, user: "Ляззат", xp: 760, avatar: "Л" },
  { rank: 10, user: "Марат", xp: 720, avatar: "М" },
];

const getMedal = (rank: number) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Trophy className="w-6 h-6 text-slate-400" />;
  if (rank === 3) return <Trophy className="w-6 h-6 text-amber-700" />;
  return <span className="text-muted-foreground font-medium">{rank}</span>;
}

export default function LeaderboardPage() {
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
              {leaderboardData.map((entry) => (
                <TableRow key={entry.rank} className="font-medium">
                  <TableCell className="text-center">{getMedal(entry.rank)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                         <AvatarImage src={`https://picsum.photos/seed/${entry.user}/40/40`} />
                        <AvatarFallback>{entry.avatar}</AvatarFallback>
                      </Avatar>
                      <span>{entry.user}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-lg">{entry.xp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
