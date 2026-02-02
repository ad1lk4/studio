import { sections } from '@/lib/lessons';
import LessonPath from '@/components/LessonPath';

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Ваш путь к знаниям</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Проходите уроки шаг за шагом, чтобы освоить казахский язык.
        </p>
      </div>
      <LessonPath sections={sections} />
    </div>
  );
}
