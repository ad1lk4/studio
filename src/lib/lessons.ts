import type { Section } from './types';

export const sections: Section[] = [
  {
    id: 'section-1',
    title: 'Основы 1',
    totalPoints: 25,
    lessons: [
      {
        id: 's1-l1',
        title: 'Приветствия',
        sectionId: 'section-1',
        points: 5,
        tasks: [
          {
            id: 's1-l1-t1',
            type: 'MULTIPLE_CHOICE',
            question: 'Выберите правильный перевод для "Привет"',
            options: ['Сәлем', 'Рахмет', 'Иә', 'Жоқ'],
            correctAnswer: 'Сәлем',
          },
          {
            id: 's1-l1-t2',
            type: 'MATCH_PAIRS',
            question: 'Соотнесите фразы',
            pairs: [
              { prompt: 'Доброе утро', answer: 'Қайырлы таң' },
              { prompt: 'Как дела?', answer: 'Қалайсың?' },
              { prompt: 'Спасибо', answer: 'Рахмет' },
            ],
          },
          {
            id: 's1-l1-t3',
            type: 'SENTENCE_BUILDER',
            question: 'Составьте фразу: "Как у вас дела?"',
            words: ['Сіздің', 'істеріңіз', 'қалай?'],
            correctAnswer: 'Сіздің істеріңіз қалай?',
          },
           {
            id: 's1-l1-t4',
            type: 'TRUE_FALSE',
            question: 'Верно ли: "Сау болыңыз" означает "Здравствуйте".',
            correctAnswer: false,
            explanation: '"Сау болыңыз" означает "До свидания".',
          },
        ],
      },
      {
        id: 's1-l2',
        title: 'Знакомство',
        sectionId: 'section-1',
        points: 5,
        tasks: [
          {
            id: 's1-l2-t1',
            type: 'SENTENCE_BUILDER',
            question: 'Составьте предложение: "Меня зовут Айсулу."',
            words: ['Менің', 'атым', 'Айсулу.'],
            correctAnswer: 'Менің атым Айсулу.',
          },
          {
            id: 's1-l2-t2',
            type: 'MULTIPLE_CHOICE',
            question: 'Как спросить "Как вас зовут?"',
            options: ['Сіздің атыңыз кім?', 'Сен қайдансың?', 'Не істеп жатырсың?'],
            correctAnswer: 'Сіздің атыңыз кім?',
          },
          {
            id: 's1-l2-t3',
            type: 'MATCH_PAIRS',
            question: 'Соотнесите вопрос и ответ',
            pairs: [
              { prompt: 'Сәлем!', answer: 'Сәлем!' },
              { prompt: 'Қалайсың?', answer: 'Жақсы' },
              { prompt: 'Сіздің атыңыз кім?', answer: 'Менің атым...' },
            ],
          },
        ],
      },
      {
        id: 's1-l3',
        title: 'Семья',
        sectionId: 'section-1',
        points: 5,
        tasks: [
           {
            id: 's1-l3-t1',
            type: 'MULTIPLE_CHOICE',
            question: 'Как будет "мама" на казахском?',
            options: ['Ана', 'Әке', 'Аға', 'Апа'],
            correctAnswer: 'Ана',
          },
          {
            id: 's1-l3-t2',
            type: 'ODD_ONE_OUT',
            question: 'Найдите лишнее слово.',
            options: ['Ана', 'Әке', 'Мектеп', 'Бала'],
            correctAnswer: 'Мектеп',
            explanation: '"Мектеп" (школа) не является членом семьи.'
          },
          {
            id: 's1-l3-t3',
            type: 'SENTENCE_BUILDER',
            question: 'Составьте предложение: "Это моя семья."',
            words: ['Бұл', 'менің', 'отбасым.'],
            correctAnswer: 'Бұл менің отбасым.',
          }
        ],
      },
      {
        id: 's1-l4',
        title: 'Еда 1',
        sectionId: 'section-1',
        points: 5,
        tasks: [
          {
            id: 's1-l4-t1',
            type: 'MULTIPLE_CHOICE',
            question: 'Выберите перевод для "хлеб"',
            options: ['Нан', 'Су', 'Алма', 'Сүт'],
            correctAnswer: 'Нан',
          },
           {
            id: 's1-l4-t2',
            type: 'MATCH_PAIRS',
            question: 'Соотнесите слова',
            pairs: [
              { prompt: 'Вода', answer: 'Су' },
              { prompt: 'Яблоко', answer: 'Алма' },
              { prompt: 'Молоко', answer: 'Сүт' },
            ],
          },
        ],
      },
      {
        id: 's1-l5',
        title: 'Животные 1',
        sectionId: 'section-1',
        points: 5,
        tasks: [
           {
            id: 's1-l5-t1',
            type: 'MULTIPLE_CHOICE',
            question: 'Как будет "кошка" на казахском?',
            options: ['Мысық', 'Ит', 'Ат', 'Сиыр'],
            correctAnswer: 'Мысық',
          },
           {
            id: 's1-l5-t2',
            type: 'TRUE_FALSE',
            question: 'Верно ли: "Ит" - это "лошадь".',
            correctAnswer: false,
            explanation: '"Ит" - это "собака", а "лошадь" - это "ат".'
          },
        ],
      },
    ],
  },
  {
    id: 'section-2',
    title: 'Основы 2 (в разработке)',
    totalPoints: 50,
    lessons: [
       ...Array.from({ length: 10 }, (_, i) => ({
        id: `s2-l${i + 1}`,
        title: `Урок ${i + 1}`,
        sectionId: 'section-2',
        points: 5,
        tasks: [],
      })),
    ],
  },
];
