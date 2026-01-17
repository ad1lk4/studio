'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navItems = [
  { href: '/learn', label: 'Обучение' },
  { href: '/leaderboard', label: 'Таблица лидеров' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Image
            src="https://i.pinimg.com/736x/81/2d/96/812d96c9c41284534f46a9479370776b.jpg"
            alt="Sөyle! Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-bold text-lg">Sөyle!</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Войти</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Регистрация</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
