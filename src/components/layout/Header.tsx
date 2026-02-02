'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { LogOut, User as UserIcon, Menu } from 'lucide-react';


const navItems = [
  { href: '/learn', label: 'Обучение' },
  { href: '/leaderboard', label: 'Таблица лидеров' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
    router.refresh();
  };

  const getAvatarFallback = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return <UserIcon />;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Image src="https://i.ibb.co/v430Tx3S/Whats-App-Image-2026-01-17-at-13-04-56.jpg" alt="Sөyle! Logo" width={40} height={40} className="object-cover rounded-full" />
          <span className="font-bold text-lg">Sөyle!</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
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
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isUserLoading ? (
              <div className="w-24 h-8 bg-muted rounded-md animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.uid}`} alt="User avatar" />
                          <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                      </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Пользователь
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile"><UserIcon className="mr-2 h-4 w-4" />Профиль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Войти</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Регистрация</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Открыть меню</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
                <Link href="/" className="mr-6 flex items-center gap-2 mb-4">
                  <Image src="https://i.ibb.co/v430Tx3S/Whats-App-Image-2026-01-17-at-13-04-56.jpg" alt="Sөyle! Logo" width={32} height={32} className="object-cover rounded-full" />
                  <span className="font-bold text-lg">Sөyle!</span>
                </Link>
                <Separator />
                <nav className="flex flex-col gap-4 text-lg font-medium mt-4">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'transition-colors hover:text-foreground/80',
                          pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto">
                  <Separator className="my-4" />
                  {isUserLoading ? (
                      <div className="w-full h-20 bg-muted rounded-md animate-pulse" />
                  ) : user ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.uid}`} alt="User avatar" />
                          <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            Пользователь
                          </p>
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="w-full justify-start mt-2">
                          <Link href="/profile"><UserIcon className="mr-2 h-4 w-4" />Профиль</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                          <LogOut className="mr-2 h-4 w-4" />
                          Выйти
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <SheetClose asChild>
                        <Button asChild className="w-full">
                          <Link href="/login">Войти</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/signup">Регистрация</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
