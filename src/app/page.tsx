import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Trophy } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { KazakhOrnament } from '@/components/KazakhOrnament';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
const feature1Image = PlaceHolderImages.find((img) => img.id === 'feature-1');
const feature2Image = PlaceHolderImages.find((img) => img.id === 'feature-2');
const feature3Image = PlaceHolderImages.find((img) => img.id === 'feature-3');

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-card overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="absolute inset-0 z-0 opacity-5">
            <KazakhOrnament className="absolute -top-1/4 -left-1/4 w-[50vw] h-[50vw] text-primary" />
            <KazakhOrnament className="absolute -bottom-1/4 -right-1/4 w-[50vw] h-[50vw] text-accent" />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Изучай казахский язык с <span className="text-primary">KazakhLingua</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
              Погрузись в мир казахской культуры через увлекательные уроки и интерактивные задания. Начни свой путь к свободному владению языком уже сегодня!
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="text-lg">
                <Link href="/learn">Начать обучение</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {heroImage && (
        <section className="container mx-auto px-4 md:px-6 my-16">
          <div className="w-full h-64 md:h-96 relative rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </section>
      )}

      <section className="w-full py-16 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Почему KazakhLingua?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader className="items-center">
                {feature1Image && (
                  <div className="w-full h-40 relative mb-4">
                    <Image
                      src={feature1Image.imageUrl}
                      alt={feature1Image.description}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint={feature1Image.imageHint}
                    />
                  </div>
                )}
                <CardTitle className="flex items-center gap-2"><Zap className="text-primary" />Интерактивные уроки</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>Задания в игровой форме, которые делают обучение не только эффективным, но и веселым.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="items-center">
                {feature2Image && (
                  <div className="w-full h-40 relative mb-4">
                    <Image
                      src={feature2Image.imageUrl}
                      alt={feature2Image.description}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint={feature2Image.imageHint}
                    />
                  </div>
                )}
                <CardTitle className="flex items-center gap-2"><CheckCircle className="text-accent" />Сохранение прогресса</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>Регистрируйся и отслеживай свои достижения. Не теряй ни одного балла опыта!</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="items-center">
                 {feature3Image && (
                  <div className="w-full h-40 relative mb-4">
                    <Image
                      src={feature3Image.imageUrl}
                      alt={feature3Image.description}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint={feature3Image.imageHint}
                    />
                  </div>
                )}
                <CardTitle className="flex items-center gap-2"><Trophy className="text-primary" />Таблица лидеров</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>Соревнуйся с другими учениками и стань лучшим в изучении казахского языка.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="w-full py-6 mt-auto bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KazakhLingua. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
