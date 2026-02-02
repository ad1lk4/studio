import { sections } from '@/lib/lessons';
import { notFound } from 'next/navigation';
import LessonPlayer from '@/components/LessonPlayer';

type LessonPageProps = {
  params: {
    lessonId: string;
  };
};

export default function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = params;
  const lesson = sections
    .flatMap((section) => section.lessons)
    .find((l) => l.id === lessonId);

  if (!lesson || lesson.tasks.length === 0) {
    notFound();
  }

  return (
    <LessonPlayer lesson={lesson} />
  );
}

export async function generateStaticParams() {
    const paths = sections.flatMap(section => section.lessons).map(lesson => ({
        lessonId: lesson.id,
    }));

    return paths;
}
