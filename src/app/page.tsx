import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Trophy } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const feature1Image = PlaceHolderImages.find((img) => img.id === 'feature-1');
const feature2Image = PlaceHolderImages.find((img) => img.id === 'feature-2');
const feature3Image = PlaceHolderImages.find((img) => img.id === 'feature-3');

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative w-full py-20 md:py-32 lg:py-40 text-white bg-cover bg-center"
        style={{ backgroundImage: "url('https://i.pinimg.com/564x/44/9a/79/449a7949b1c70e2802b79a1f734f1c43.jpg')" }}
        data-ai-hint="kazakh ornament"
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Изучай казахский язык с <span className="text-primary">Sөyle!</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-100 md:text-xl">
            Погрузись в мир казахской культуры через увлекательные уроки и интерактивные задания. Начни свой путь к свободному владению языком уже сегодня!
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="text-lg">
              <Link href="/learn">Начать обучение</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Почему Sөyle!?</h2>
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
          <p>&copy; {new Date().getFullYear()} Sөyle!. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
