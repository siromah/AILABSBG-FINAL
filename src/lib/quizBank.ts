import type { QuizQuestion, QuizOption } from './missionTypes';
import type { Mission } from './missionTypes';

type BankQuestion = QuizQuestion & {
  topics: string[];
  source?: string;
};

const OPTIONS = ['A', 'B', 'C', 'D'] as QuizOption[];

const QB = (q: Omit<BankQuestion, 'xpReward'>): BankQuestion => ({
  ...q,
  xpReward: 10,
});

/*
  Въпросите по-долу са адаптирани от утвърдени източници за AI концепции
  (Sanfoundry, GeeksforGeeks, UC Berkeley AI materials, Stanford HAI, etc.)
  и преведени/локализирани на български за AILABS.BG.
*/
export const QUIZ_BANK: BankQuestion[] = [
  // === Основи на AI ===
  QB({
    id: 'bank-ai-1',
    topics: ['ai-foundations-what-is-ai'],
    question: 'Кой учен въвежда термина „Artificial Intelligence“ през 1956 г.?',
    options: {
      A: 'Alan Turing',
      B: 'John McCarthy',
      C: 'Geoffrey Hinton',
      D: 'Andrew Ng',
    },
    correctAnswer: 'B',
    explanation: 'John McCarthy организира Dartmouth Conference и popularизира термина AI.',
    source: 'Stanford AI history',
  }),
  QB({
    id: 'bank-ai-2',
    topics: ['ai-foundations-what-is-ai'],
    question: 'Кое е пример за слаб (narrow) AI?',
    options: {
      A: 'AI с човешко ниво на разбиране във всяка област',
      B: 'Филтър за спам имейли',
      C: 'Самосъзнателна машина',
      D: 'Универсален изкуствен интелект',
    },
    correctAnswer: 'B',
    explanation: 'Филтърът за спам е специализиран в една задача — класически narrow AI.',
    source: 'Sanfoundry AI basics',
  }),
  QB({
    id: 'bank-ai-3',
    topics: ['ai-foundations-what-is-ai'],
    question: 'AI системите учат шаблони предимно от:',
    options: {
      A: 'Хардуер',
      B: 'Правила, зададени от програмист',
      C: 'Данни',
      D: 'Интернет връзка',
    },
    correctAnswer: 'C',
    explanation: 'Съвременният AI се обучава върху данни, а не само от изрични правила.',
    source: 'UC Berkeley CS188',
  }),
  QB({
    id: 'bank-ai-4',
    topics: ['ai-foundations-what-is-ai'],
    question: 'Тестът на Тюринг оценява дали машината може:',
    options: {
      A: 'Да реши математическа задача за 1 секунда',
      B: 'Да покаже интелигентно поведение, неразличимо от човешко',
      C: 'Да преведе езици',
      D: 'Да победи човек в шах',
    },
    correctAnswer: 'B',
    explanation: 'Тестът на Тюринг измерва способността на машината да имитира човешки разговор.',
    source: 'Turing, 1950',
  }),

  // === Machine Learning ===
  QB({
    id: 'bank-ml-1',
    topics: ['ai-foundations-ml'],
    question: 'При supervised learning обучителните данни включват:',
    options: {
      A: 'Само входни примери без етикети',
      B: 'Входни примери заедно с правилните отговори (етикети)',
      C: 'Само награди и наказания',
      D: 'Случайно генерирани числа',
    },
    correctAnswer: 'B',
    explanation: 'Supervised learning използва етикетирани примери, за да научи модела.',
    source: 'Andrew Ng ML course',
  }),
  QB({
    id: 'bank-ml-2',
    topics: ['ai-foundations-ml'],
    question: 'Кой от следните алгоритми често се използва за класификация?',
    options: {
      A: 'HTML',
      B: 'Random Forest',
      C: 'HTTP',
      D: 'CSS',
    },
    correctAnswer: 'B',
    explanation: 'Random Forest е популярен ML алгоритъм за класификация и регресия.',
    source: 'Breiman, 2001',
  }),
  QB({
    id: 'bank-ml-3',
    topics: ['ai-foundations-ml'],
    question: 'Overfitting означава, че моделът:',
    options: {
      A: 'Запомня обучителните данни, вместо да намира обобщаващи шаблони',
      B: 'Е твърде прост',
      C: 'Не се обучава',
      D: 'Работи само с малки данни',
    },
    correctAnswer: 'A',
    explanation: 'Overfitting се случва, когато моделът се научи твърде добре на конкретните обучителни примери и не генерализира.',
    source: 'Hastie, Tibshirani, Friedman',
  }),
  QB({
    id: 'bank-ml-4',
    topics: ['ai-foundations-ml'],
    question: 'Unsupervised learning се използва, когато:',
    options: {
      A: 'Имаме етикетирани примери',
      B: 'Искаме да научим чрез награди',
      C: 'Имаме данни без етикети и търсим скрити структури',
      D: 'Искаме да преведем текст',
    },
    correctAnswer: 'C',
    explanation: 'Unsupervised learning търси структури като клъстери в данни без етикети.',
    source: 'Goodfellow et al., Deep Learning',
  }),

  // === Deep Learning ===
  QB({
    id: 'bank-dl-1',
    topics: ['ai-foundations-deep-learning'],
    question: 'Deep learning използва:',
    options: {
      A: 'Правила, написани на ръка',
      B: 'Невронни мрежи с много слоеве',
      C: 'Само таблици',
      D: 'Линейни уравнения без параметри',
    },
    correctAnswer: 'B',
    explanation: 'Deep learning се базира на многослойни невронни мрежи.',
    source: 'LeCun, Bengio, Hinton, 2015',
  }),
  QB({
    id: 'bank-dl-2',
    topics: ['ai-foundations-deep-learning'],
    question: 'Изкуственият неврон по същество изчислява:',
    options: {
      A: 'Средна стойност на входовете',
      B: 'Претеглена сума на входовете + нелинейна активация',
      C: 'Брой думи в текста',
      D: 'Размера на файла',
    },
    correctAnswer: 'B',
    explanation: 'Невронът умножава входовете по тегла, сумира ги и прилага активационна функция.',
    source: 'Goodfellow et al., Deep Learning',
  }),
  QB({
    id: 'bank-dl-3',
    topics: ['ai-foundations-deep-learning'],
    question: 'Convolutional Neural Network (CNN) е особено ефективна за:',
    options: {
      A: 'Текстови данни',
      B: 'Изображения',
      C: 'Таблици с продажби',
      D: 'Аудио транскрипция',
    },
    correctAnswer: 'B',
    explanation: 'CNN архитектурата е проектирана да улавя пространствени шаблони в изображения.',
    source: 'Krizhevsky et al., ImageNet, 2012',
  }),
  QB({
    id: 'bank-dl-4',
    topics: ['ai-foundations-deep-learning'],
    question: 'Защо обучението на големи deep learning модели е скъпо?',
    options: {
      A: 'Защото изискват много изчисления и данни',
      B: 'Защото трябва да се плаща за всеки ред код',
      C: 'Защото работят само на смартфони',
      D: 'Защото не използват данни',
    },
    correctAnswer: 'A',
    explanation: 'Големите мрежи изискват GPU/TPU хардуер и огромни масиви от данни.',
    source: 'OpenAI scaling laws',
  }),

  // === Prompt Engineering basics ===
  QB({
    id: 'bank-pe-1',
    topics: ['prompt-engineering-basics'],
    question: 'Prompt engineering е:',
    options: {
      A: 'Писане на код на Python',
      B: 'Изкуството да пишеш ефективни инструкции към AI модел',
      C: 'Обучение на нов модел',
      D: 'Оптимизация на хардуер',
    },
    correctAnswer: 'B',
    explanation: 'Prompt engineering е начинът, по който формулираме инструкциите, за да получим по-добър резултат.',
    source: 'OpenAI / Anthropic best practices',
  }),
  QB({
    id: 'bank-pe-2',
    topics: ['prompt-engineering-basics'],
    question: 'Даването на няколко примера в prompt се нарича:',
    options: {
      A: 'Zero-shot prompting',
      B: 'Few-shot prompting',
      C: 'Fine-tuning',
      D: 'Transfer learning',
    },
    correctAnswer: 'B',
    explanation: 'Few-shot prompting включва примери, от които моделът да се учи преди задачата.',
    source: 'Brown et al., GPT-3 paper, 2020',
  }),
  QB({
    id: 'bank-pe-3',
    topics: ['prompt-engineering-basics', 'prompt-engineering-role'],
    question: 'Кой елемент задава перспективата и експертизата в prompt?',
    options: {
      A: 'Формат',
      B: 'Роля',
      C: 'Ограничение',
      D: 'Контекст',
    },
    correctAnswer: 'B',
    explanation: 'Ролята казва на AI от чия гледна точка и с каква експертиза да отговаря.',
    source: 'Anthropic prompt engineering guide',
  }),
  QB({
    id: 'bank-pe-4',
    topics: ['prompt-engineering-basics'],
    question: 'Zero-shot prompting означава:',
    options: {
      A: 'Много примери',
      B: 'Без примери — само инструкция',
      C: 'Обучение от нула',
      D: 'Използване на RAG',
    },
    correctAnswer: 'B',
    explanation: 'Zero-shot не дава примери, а разчита само на инструкцията.',
    source: 'Brown et al., 2020',
  }),

  // === LLM Tokens ===
  QB({
    id: 'bank-llm-1',
    topics: ['llm-models-tokens'],
    question: 'LLM обработват текста на порции, наречени:',
    options: {
      A: 'Байтове',
      B: 'Токени',
      C: 'Думи',
      D: 'Букви',
    },
    correctAnswer: 'B',
    explanation: 'Токените са единиците текст, които моделът вижда и генерира.',
    source: 'OpenAI tokenizer documentation',
  }),
  QB({
    id: 'bank-llm-2',
    topics: ['llm-models-tokens'],
    question: 'API ценообразуването на LLM обикновено е на база:',
    options: {
      A: 'Брой потребители',
      B: 'Брой токени',
      C: 'Брой думи',
      D: 'Брой заявки',
    },
    correctAnswer: 'B',
    explanation: 'Плаща се за входящи и изходящи токени.',
    source: 'OpenAI / Anthropic pricing',
  }),
  QB({
    id: 'bank-llm-3',
    topics: ['llm-models-tokens'],
    question: 'Една английска дума обикновено съответства на приблизително:',
    options: {
      A: '0.75 токена',
      B: '5 токена',
      C: '10 токена',
      D: '1 дума = винаги 1 токен',
    },
    correctAnswer: 'A',
    explanation: 'На английски една дума е средно около 0.75 токена; българските думи са малко повече.',
    source: 'OpenAI tokenizer',
  }),

  // === Context Window / RAG ===
  QB({
    id: 'bank-ctx-1',
    topics: ['llm-models-context-window'],
    question: 'Контекстният прозорец на LLM ограничава:',
    options: {
      A: 'Цвета на интерфейса',
      B: 'Броя токени, които моделът може да обработи наведнъж',
      C: 'Броя потребители',
      D: 'Скоростта на интернет',
    },
    correctAnswer: 'B',
    explanation: 'Контекстният прозорец е максималният брой токени за вход + отговор.',
    source: 'Stanford CS324',
  }),
  QB({
    id: 'bank-ctx-2',
    topics: ['llm-models-context-window'],
    question: 'RAG означава:',
    options: {
      A: 'Random Answer Generation',
      B: 'Retrieval-Augmented Generation',
      C: 'Real-time API Gateway',
      D: 'Recursive Auto-Generator',
    },
    correctAnswer: 'B',
    explanation: 'RAG извлича релевантна информация от външна база знания, преди да генерира отговор.',
    source: 'Lewis et al., 2020',
  }),
  QB({
    id: 'bank-ctx-3',
    topics: ['llm-models-context-window'],
    question: 'Chunking в контекста на LLM е:',
    options: {
      A: 'Изтриване на текст',
      B: 'Разделяне на дълъг текст на по-малки части',
      C: 'Криптиране',
      D: 'Превод',
    },
    correctAnswer: 'B',
    explanation: 'Chunking разделя документи на управляеми части, които се побират в контекста.',
    source: 'LangChain / LlamaIndex docs',
  }),

  // === Hallucinations ===
  QB({
    id: 'bank-hal-1',
    topics: ['llm-models-hallucinations'],
    question: 'Халюцинация при LLM е:',
    options: {
      A: 'AI вижда образи',
      B: 'Генериране на убедителна, но невярна информация',
      C: 'Бавна работа на модела',
      D: 'Прекалено кратък отговор',
    },
    correctAnswer: 'B',
    explanation: 'Халюцинациите са фалшиви факти, представени с увереност.',
    source: 'Ji et al., Survey of Hallucination in NLP, 2023',
  }),
  QB({
    id: 'bank-hal-2',
    topics: ['llm-models-hallucinations'],
    question: 'Кой подход помага за намаляване на халюцинациите?',
    options: {
      A: 'Да не поставяш ограничения',
      B: 'Да изискваш източници и да grounding-ваш отговора в документи',
      C: 'Да използваш по-малък модел',
      D: 'Да пишеш по-дълги prompts',
    },
    correctAnswer: 'B',
    explanation: 'Източниците и RAG grounding ограничават модела да създава факти.',
    source: 'Lewis et al., RAG, 2020',
  }),
  QB({
    id: 'bank-hal-3',
    topics: ['llm-models-hallucinations'],
    question: 'Защо LLM могат да измислят цитати?',
    options: {
      A: 'Защото имат достъп до Google',
      B: 'Защото генерират вероятен текст, без да проверяват реални източници',
      C: 'Защото са злонамерени',
      D: 'Защото не знаят езика',
    },
    correctAnswer: 'B',
    explanation: 'LLM предвиждат вероятни последователности от думи, които могат да изглеждат като реални, но измислени цитати.',
    source: 'Ji et al., 2023',
  }),

  // === Generative AI ===
  QB({
    id: 'bank-gen-1',
    topics: ['ai-foundations-generative-ai'],
    question: 'Основната разлика между генеративен и дискриминативен AI е, че генеративният:',
    options: {
      A: 'Само класифицира',
      B: 'Създава ново съдържание',
      C: 'Не използва данни',
      D: 'Работи само с числа',
    },
    correctAnswer: 'B',
    explanation: 'Генеративните модели произвеждат нови примери (текст, изображения, звук), а дискриминативните класифицират.',
    source: 'Goodfellow et al., GANs, 2014',
  }),
  QB({
    id: 'bank-gen-2',
    topics: ['ai-foundations-generative-ai'],
    question: 'Midjourney е популярен инструмент за:',
    options: {
      A: 'Писане на код',
      B: 'Генериране на изображения от текст',
      C: 'Анализ на данни',
      D: 'Автоматизация на workflows',
    },
    correctAnswer: 'B',
    explanation: 'Midjourney е текст-към-изображение генеративен модел.',
    source: 'Midjourney documentation',
  }),

  // === LLM fundamentals ===
  QB({
    id: 'bank-llm-fund-1',
    topics: ['ai-foundations-llm'],
    question: 'Големият езиков модел (LLM) по същество предвижда:',
    options: {
      A: 'Следващата дума в последователност',
      B: 'Времето за утре',
      C: 'Цената на акции',
      D: 'Паролата на потребителя',
    },
    correctAnswer: 'A',
    explanation: 'LLM моделите предвиждат вероятността за всяка следваща дума (токен).',
    source: 'Radford et al., GPT-2, 2019',
  }),
  QB({
    id: 'bank-llm-fund-2',
    topics: ['ai-foundations-llm'],
    question: 'Transformer архитектурата е основа за:',
    options: {
      A: 'Релационните бази данни',
      B: 'Съвременните големи езикови модели',
      C: 'Компютърните мишки',
      D: 'Операционните системи',
    },
    correctAnswer: 'B',
    explanation: 'Трансформърите са архитектурата зад GPT, BERT и други съвременни LLM.',
    source: 'Vaswani et al., Attention Is All You Need, 2017',
  }),
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getMissionQuizQuestions(mission: Mission, count = 5): QuizQuestion[] {
  const topics = new Set([mission.id, mission.moduleId]);
  const matched = QUIZ_BANK.filter((q) => q.topics.some((t) => topics.has(t)));
  const bankPicked = shuffle(matched).slice(0, count);

  const bankIds = new Set(bankPicked.map((q) => q.id));
  const fallbackNeeded = count - bankPicked.length;
  const fallback =
    fallbackNeeded > 0
      ? shuffle(mission.quiz.filter((q) => !bankIds.has(q.id))).slice(0, fallbackNeeded)
      : [];

  const final: (BankQuestion | QuizQuestion)[] = [...bankPicked, ...fallback];

  // Винаги връщаме поне съществуващите въпроси, ако банката е празна.
  if (final.length === 0) return mission.quiz;

  return final.map((q) => {
    const { topics: _, source: __, ...rest } = q as BankQuestion;
    return rest;
  });
}
