export const PROMPTS = [
  {id:'pr1',title:'Email sequence automation',cat:'automation',text:'Напиши 5-стъпкова email nurture sequence за [продукт/услуга]. Всеки email трябва да е фокусиран върху конкретна болка на клиента. Тон: приятелски и professional. Включи subject lines.',saves:4,isFree:true},
  {id:'pr2',title:'Instagram caption generator',cat:'content',text:'Ти си expert social media copywriter. Напиши 5 Instagram caption варианта за [тема]. Тонът трябва да е [описание]. Включи CTA. Максимум 150 думи.',saves:7,isFree:true},
  {id:'pr3',title:'Meeting summary builder',cat:'productivity',text:'Ти си executive assistant. Ето notes от среща: [notes]. Напиши чист summary с: 1) Основни решения 2) Action items с отговорни и дедлайни 3) Следваща стъпка.',saves:3,isFree:true},
  {id:'pr4',title:'Customer support response',cat:'business',text:'Ти си friendly customer support agent за [компания]. Клиент пише: "[съобщение]". Напиши empathetic отговор, предложи решение, и предложи follow-up. Тон: топъл и professional.',saves:2,isFree:false},
  {id:'pr5',title:'Blog post outline creator',cat:'marketing',text:'Напиши детайлен outline за blog post на тема: [тема]. Включи: compelling hook, 5-7 main sections с подточки, key takeaways и CTA. Target audience: [аудитория].',saves:3,isFree:false},
  {id:'pr6',title:'Make.com automation plan',cat:'automation',text:'Помогни ми да опиша automation workflow за Make.com. Имам [входящи данни] и искам да получа [резултат]. Какви modules трябва да използвам и в какъв ред?',saves:2,isFree:false},
  {id:'pr7',title:'Cold email outreach',cat:'marketing',text:'Напиши personalized cold email за [prospect]. Те работят в [индустрия] и имат [проблем]. Нашето решение е [решение]. Email трябва да е кратък (150 думи), без buzzwords, с един clear CTA.',saves:4,isFree:false},
  {id:'pr8',title:'Competitor analysis',cat:'business',text:'Направи анализ на [конкурент]. Включи: техните strengths и weaknesses, positioning, target audience, pricing strategy, и как можем да се диференцираме.',saves:1,isFree:false},
  {id:'pr9',title:'Daily AI productivity plan',cat:'productivity',text:'Помогни ми да планирам деня си с AI. Имам следните задачи: [задачи]. Приоритизирай ги, предложи кои могат да се автоматизират с AI, и създай time-blocked schedule.',saves:5,isFree:false},
  {id:'pr10',title:'TikTok script writer',cat:'content',text:'Напиши TikTok script за видео на тема [тема]. Включи: hook (първите 3 секунди), основно съдържание, и strong ending. Продължителност: [секунди]. Тон: [описание].',saves:4,isFree:false},
  {id:'pr11',title:'Product description e-commerce',cat:'marketing',text:'Напиши compelling product description за [продукт]. Включи: главна headline, 3 key benefits, technical specs, и CTA. Target customer: [описание]. Tone: [tone].',saves:2,isFree:false},
  {id:'pr12',title:'Meeting agenda creator',cat:'productivity',text:'Създай agenda за [вид среща] с [хора] за [продължителност]. Целта на срещата: [цел]. Включи timeboxing за всяка точка и кой е responsible.',saves:1,isFree:false}
];

export const LESSONS_MODS = [
  {title:'Ден 1 — AI Foundations',lessons:[
    {id:'l1',title:'Въведение в AI инструментите',dur:'12 мин',h:'Въведение в AI инструментите',p1:'В този урок ще разгледаме основните AI инструменти — ChatGPT, Claude и Gemini. Ще разберем разликите между тях и кога да използваме кой.',p2:'ChatGPT е най-популярният и добър за general tasks. Claude е по-нюансиран и подходящ за дълги анализи и business задачи. Gemini се интегрира добре с Google Workspace.',p3:'Ключовото разбиране: различните AI инструменти имат различни strengths. Истинският power идва, когато знаеш кога да използваш кой.',isFree:true,xp:25},
    {id:'l2',title:'Prompt Engineering основи',dur:'18 мин',h:'Prompt Engineering основи',p1:'Prompt engineering е изкуството да комуникираш ефективно с AI. Добрият prompt е ясен, конкретен и дава context.',p2:'Структурата на добрия prompt: Роля + Задача + Context + Формат + Ограничения. Например: "Ти си expert copywriter. Напиши email за [клиент]. Тонът трябва да е professional. Максимум 200 думи."',p3:'Практическо упражнение: Вземи задача, която имаш тази седмица, и напиши prompt по тази структура. Сравни резултатите с и без структурата.',isFree:true,xp:25},
    {id:'l3',title:'AI Productivity System',dur:'22 мин',h:'AI Productivity System',p1:'Вместо да отваряш ChatGPT random, трябва да изградиш система. AI Productivity System е набор от готови prompts, workflows и навици.',p2:'Компонентите: 1) Prompt Library с твоите най-използвани prompts 2) Daily AI habits 3) Template библиотека 4) Output review процес.',p3:'Инструменти: Notion за организиране на prompts, ChatGPT за изпълнение, Perplexity за research. Ключово: всеки ден прави 3 неща с AI, дори малки.',isFree:false,xp:30},
    {id:'l4',title:'ChatGPT vs Claude vs Gemini',dur:'15 мин',h:'ChatGPT, Claude и Gemini — кога какво да използваш',p1:'Всеки AI модел има своите strengths. Разбирането на тези разлики ти дава огромно предимство.',p2:'ChatGPT: най-добър за creative writing, coding, и general tasks. Claude: най-добър за дълги анализи, business writing, и nuanced задачи. Gemini: най-добър за Google integration и multimodal tasks.',p3:'Практика: Тази седмица използвай само един tool и научи limits-ите му. Следващата седмица опитай друг за същите задачи. Разликата ще те изненада.',isFree:false,xp:30},
    {id:'l5',title:'AI Workflows 101',dur:'20 мин',h:'AI Workflows 101',p1:'Workflow е последоватателност от AI-assisted стъпки, която превръща input в output по предсказуем начин.',p2:'Пример за content workflow: Research (Perplexity) → Outline (Claude) → Draft (ChatGPT) → Edit (Claude) → Image (Midjourney) → Publish.',p3:'Защо workflows са важни: Повтаряемост. Качество. Скорост. Когато workflow-ът е готов, можеш да го делегираш или автоматизираш.',isFree:false,xp:35}
  ]},
  {title:'Ден 2 — Content & Automation',lessons:[
    {id:'l6',title:'AI Content System',dur:'25 мин',h:'AI Content System',p1:'AI Content System е набор от workflows, templates и processes, които позволяват да произвеждаш повече content с по-малко усилие.',p2:'Компонентите: Content Calendar AI, Repurposing workflows, Voice/Tone consistency, Bulk creation strategies.',p3:'Начало: Документирай как правиш content сега. После добави AI на всяка стъпка. Накрая имаш система.',isFree:true,xp:30},
    {id:'l7',title:'Automation с Make.com',dur:'30 мин',h:'Automation с Make.com',p1:'Make.com (бивш Integromat) е visual automation builder. Позволява да свързваш AI tools без код.',p2:'Основни концепции: Triggers (кое задейства automation), Modules (какво се прави), Routing (условия), Data Stores.',p3:'Първи проект: Вземи email от клиент → Claude анализира sentiment → ако е negative, изпраща alert в Slack. 30 минути работа.',isFree:false,xp:35},
    {id:'l8',title:'Social Media AI Workflows',dur:'18 мин',h:'Social Media AI Workflows',p1:'Social media изисква постоянен content. AI може да намали времето за production с 70%.',p2:'Workflow: 1 long-form piece → AI repurpose в 5 platforms. Пример: Blog post → LinkedIn article → Twitter thread → Instagram carousel → TikTok script.',p3:'Ключово: AI не замества твоята "voice". AI ускорява production, ти добавяш authentic perspective.',isFree:false,xp:35},
    {id:'l9',title:'AI Agents — следващото ниво',dur:'22 мин',h:'AI Agents — следващото ниво',p1:'AI agents са системи, където AI може да взима решения и да изпълнява multi-step tasks автономно.',p2:'Примери: Research agent, Customer service agent, Content creation agent. Инструменти: GPT-4, Claude API, AutoGPT, AgentGPT.',p3:'Важно: Agents не са magic. Те изискват добра архитектура и oversight. Започни с прости use cases.',isFree:false,xp:40},
    {id:'l10',title:'Video AI Tools',dur:'16 мин',h:'Video AI Tools',p1:'Video content е бъдещето. AI прави video production достъпно за всеки.',p2:'Tools: ElevenLabs (voice cloning), Heygen (AI avatars), Runway (video editing), Descript (transcription + editing), Pika (text-to-video).',p3:'Workflow: Script (Claude) → Voice (ElevenLabs) → Visuals (Runway/Midjourney) → Edit (Descript) → Publish.',isFree:false,xp:40}
  ]},
  {title:'Ден 3 — Business AI Systems',lessons:[
    {id:'l11',title:'AI за продажби',dur:'24 мин',h:'AI за продажби и business development',p1:'AI може да трансформира sales процеса — от lead research до email follow-up.',p2:'Use cases: Lead scoring, Personalized outreach, Meeting prep, Proposal writing, Objection handling scripts.',p3:'Пример: Преди среща → AI research на компанията и contact-а → Personalized agenda → Follow-up email template готов.',isFree:true,xp:35},
    {id:'l12',title:'Customer Support AI',dur:'19 мин',h:'Customer Support AI',p1:'AI може да обработва 70% от customer queries автоматично, оставяйки сложните cases за хора.',p2:'Архитектура: FAQ база → Claude API → Routing logic → Human escalation. Инструменти: Intercom, Zendesk, custom.',p3:'Важно: AI трябва да знае кога да каже "не знам" и да ескалира. Никога не лъже клиента.',isFree:false,xp:40},
    {id:'l13',title:'Business Automation Stack',dur:'27 мин',h:'Business Automation Stack',p1:'Automation Stack е съвкупността от tools и workflows, които автоматизират твоя бизнес.',p2:'Layers: Data (Airtable/Notion) → Automation (Make.com/Zapier) → AI (Claude API/OpenAI) → Communication (Email/Slack) → Analytics.',p3:'Принцип: Автоматизирай repetitive first. После complex. После exceptions.',isFree:false,xp:45},
    {id:'l14',title:'Scaling с AI',dur:'21 мин',h:'Scaling workflows с AI',p1:'Scaling означава повече output с по-малко пропорционален input. AI е leverage.',p2:'Стратегии: Templatize всичко, Automate repetitive, Delegate decisions на AI, Measure и optimize.',p3:'Mindset shift: Не питай "как мога да направя X?" Питай "как мога да направя 10x X с AI?"',isFree:false,xp:45},
    {id:'l15',title:'Твоят AI Roadmap',dur:'15 мин',h:'Твоят AI Business Roadmap',p1:'Последен урок: как да продължиш напред след intensive-а.',p2:'90-day plan: 30 дни — основни инструменти и habits. 60 дни — първа automation. 90 дни — measurable time savings.',p3:'Community е тук за теб. Задавай въпроси, споделяй wins, помагай на другите. Успех!',isFree:false,xp:50}
  ]}
];

export const EVENTS_DATA = [
  {id:'e1',day:'13',mo:'Юни',title:'AI Workflow Q&A',desc:'Live сесия с екипа ни. Задавай въпроси за workflows, automation и AI tools.',time:'19:00ч',dur:'90 мин',platform:'Zoom',spots:20},
  {id:'e2',day:'15',mo:'Юни',title:'Live: Prompt Engineering с Claude',desc:'Ще напишем заедно system prompts за различни бизнес use cases.',time:'18:30ч',dur:'60 мин',platform:'Zoom',spots:25},
  {id:'e3',day:'17',mo:'Юни',title:'Make.com Automation Workshop',desc:'Практически workshop — изграждаме реална automation от нула.',time:'11:00ч',dur:'120 мин',platform:'Zoom',spots:15},
  {id:'e4',day:'20',mo:'Юни',title:'AI за e-commerce: Office Hours',desc:'Специализирана сесия за e-commerce бизнеси. Customer support AI, order automation.',time:'17:00ч',dur:'90 мин',platform:'Zoom',spots:18},
  {id:'e5',day:'22',mo:'Юни',title:'Content AI Masterclass',desc:'Как да изградиш пълна AI content система за social media.',time:'19:00ч',dur:'90 мин',platform:'Zoom',spots:30}
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    desc: 'Разгледай платформата, опитай безплатните уроци и виж дали ти пасва.',
    monthly: 0,
    yearly: 0,
    features: ['3 пълни урока от академията','10+ готови prompts','Преглед на общността','Записи от избрани събития']
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'Пълен достъп до академията, prompts и общността. За хора, които ще прилагат.',
    monthly: 25,
    yearly: 250,
    features: ['Всички 15 урока','50+ тествани prompts','Пълен достъп до общността','Седмични workshops','Предизвикателства','Шаблони и workflows']
  },
  {
    id: 'premium',
    name: 'Premium',
    desc: 'Pro + лична подкрепа от екипа ни. За хора, които искат резултати бързо.',
    monthly: 65,
    yearly: 650,
    features: ['Всичко от Pro','1-на-1 AI Coaching','Личен AI roadmap','Преглед на твоите workflows','Приоритет при въпроси']
  }
];

// ============================================
// MISSIONS MODULE — Duolingo-style learning
// ============================================

export type MissionQuestionType = 'mcq' | 'truefalse' | 'fill';

export type MissionQuestion = {
  type: MissionQuestionType;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
};

export type MissionLesson = {
  id: string;
  title: string;
  goal: string;
  content: string;
  xp: number;
  questions: MissionQuestion[];
};

export type MissionModule = {
  id: string;
  title: string;
  lessons: MissionLesson[];
};

export type DailyMission = {
  id: string;
  title: string;
  description: string;
  xp: number;
  action: string;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  moduleId: string;
};

export type MissionBadgeDef = {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: 'firstLesson' | 'streak7' | 'xp100' | 'moduleComplete' | 'referrals5' | 'streak30';
};

export const MISSIONS_MODULES: MissionModule[] = [
  {
    id: 'm1',
    title: 'МОДУЛ 1 — Основи на AI',
    lessons: [
      {
        id: 'l-m1-1',
        title: 'Какво е AI',
        goal: 'Да разбереш какво е изкуствен интелект и къде се използва.',
        content: 'Изкуственият интелект (AI) е способността на машините да извършват задачи, които обикновено изискват човешки интелект — разпознаване на говор, вземане на решения, превод, генериране на текст и изображения.',
        xp: 20,
        questions: [
          {
            type: 'mcq',
            question: 'Кое е пример за AI приложение?',
            options: ['Печатане на документ', 'Гласов асистент като Siri', 'Зареждане на уеб страница'],
            answer: 'Гласов асистент като Siri',
            explanation: 'Гласовите асистенти разпознават реч, разбират смисъла и отговарят — това е класически AI.'
          },
          {
            type: 'truefalse',
            question: 'AI може да учи от данни, без да бъде изрично програмиран за всяка ситуация.',
            answer: 'Вярно',
            explanation: 'Модерният AI, особено машинното обучение, учи от примери и данни.'
          },
          {
            type: 'fill',
            question: 'AI е съкращение от _______ интелект.',
            answer: 'изкуствен',
            explanation: 'AI идва от Artificial Intelligence, което на български е изкуствен интелект.'
          }
        ]
      },
      {
        id: 'l-m1-2',
        title: 'Как работят LLM',
        goal: 'Да разбереш основната идея зад големите езикови модели.',
        content: 'Големите езикови модели (LLM) предвиждат следващата дума в последователност. Те са обучени върху огромно количество текст и могат да отговарят на въпроси, да обобщават и да пишат код.',
        xp: 25,
        questions: [
          {
            type: 'mcq',
            question: 'Какво прави LLM по същество?',
            options: ['Търси в Google', 'Предвижда следващата дума', 'Съхранява файлове'],
            answer: 'Предвижда следващата дума',
            explanation: 'LLM предвиждат вероятността за всяка следваща дума и я избират.'
          },
          {
            type: 'truefalse',
            question: 'LLM разбират текста по същия начин като хората.',
            answer: 'Невярно',
            explanation: 'LLM симулират разбиране чрез статистически модели, без истинско съзнание.'
          }
        ]
      },
      {
        id: 'l-m1-3',
        title: 'Prompt Engineering',
        goal: 'Да напишеш ясен и ефективен prompt.',
        content: 'Prompt engineering е изкуството да даваш ясни инструкции на AI. Добрият prompt включва роля, задача, контекст и желан формат.',
        xp: 30,
        questions: [
          {
            type: 'mcq',
            question: 'Кой елемент НЕ е част от добрия prompt?',
            options: ['Роля', 'Задача', 'Брой думи в речника на AI', 'Формат'],
            answer: 'Брой думи в речника на AI',
            explanation: 'Роля, задача, контекст и формат са основните елементи на добрия prompt.'
          },
          {
            type: 'fill',
            question: '„Ти си expert copywriter. Напиши email..." задава _______ в prompt-а.',
            answer: 'роля',
            explanation: 'Първото изречение задава ролята, която AI трябва да изпълнява.'
          }
        ]
      },
      {
        id: 'l-m1-4',
        title: 'AI Агенти',
        goal: 'Да разбереш какво са AI агентите и как действат автономно.',
        content: 'AI агентите са системи, които могат да планират, да използват инструменти и да изпълняват многостъпкови задачи с минимален човешки надзор.',
        xp: 35,
        questions: [
          {
            type: 'mcq',
            question: 'Кое описва AI агент?',
            options: ['Модел, който отговаря на един въпрос', 'Система, която изпълнява многостъпкови задачи автономно', 'База данни с отговори'],
            answer: 'Система, която изпълнява многостъпкови задачи автономно',
            explanation: 'Агентите комбинират планиране, памет и инструменти, за да действат самостоятелно.'
          },
          {
            type: 'truefalse',
            question: 'AI агентите винаги работят без никаква проверка от човек.',
            answer: 'Невярно',
            explanation: 'Дори добрите агенти се нуждаят от oversight и граници.'
          }
        ]
      },
      {
        id: 'l-m1-5',
        title: 'Автоматизации',
        goal: 'Да свържеш AI с инструменти като Make.com и Zapier.',
        content: 'Автоматизациите свързват тригери и действия. AI може да анализира входящи имейли, да генерира отговори и да ги изпраща автоматично.',
        xp: 40,
        questions: [
          {
            type: 'mcq',
            question: 'Какъв е редът в типична автоматизация?',
            options: ['Действие → Тригер → AI', 'Тригер → AI → Действие', 'AI → Действие → Тригер'],
            answer: 'Тригер → AI → Действие',
            explanation: 'Първо идва събитие (тригер), после AI обработва, накрая се изпълнява действие.'
          },
          {
            type: 'fill',
            question: 'Make.com и Zapier са _______ платформи.',
            answer: 'автоматизация',
            explanation: 'Те свързват различни приложения и автоматизират workflows.'
          }
        ]
      }
    ]
  },
  {
    id: 'm2',
    title: 'МОДУЛ 2 — AI за работа',
    lessons: [
      {
        id: 'l-m2-1',
        title: 'Email автоматизация',
        goal: 'Да автоматизираш email отговори с AI.',
        content: 'AI може да класифицира имейли, да извлича ключова информация и да чернова персонализирани отговори, спестявайки часове.',
        xp: 30,
        questions: [
          {
            type: 'mcq',
            question: 'Какво е първата стъпка при email автоматизация?',
            options: ['Да изпрашь 1000 имейла', 'Да класифицираш входящите имейли', 'Да изтриеш старата поща'],
            answer: 'Да класифицираш входящите имейли',
            explanation: 'Класификацията определя какъв тип действие е необходимо.'
          }
        ]
      },
      {
        id: 'l-m2-2',
        title: 'AI за съдържание',
        goal: 'Да създадеш content workflow с AI.',
        content: 'От една идея AI може да генерира outline, чернова, социални постове и SEO описания. Човекът добавя финална редакция и автентичен глас.',
        xp: 35,
        questions: [
          {
            type: 'truefalse',
            question: 'AI може напълно да замени човешката креативност.',
            answer: 'Невярно',
            explanation: 'AI ускорява production, но човекът носи уникална гледна точка и глас.'
          }
        ]
      },
      {
        id: 'l-m2-3',
        title: 'AI за анализ',
        goal: 'Да анализираш данни с AI асистент.',
        content: 'AI може да обобщава таблици, да намира тенденции и да генерира отчети от неструктурирани данни.',
        xp: 40,
        questions: [
          {
            type: 'mcq',
            question: 'Кое е силна страна на AI при анализа?',
            options: ['Да създава оригинални данни', 'Да обобщава големи количества информация', 'Да замества финансов одитор'],
            answer: 'Да обобщава големи количества информация',
            explanation: 'AI е най-силен в синтеза и обобщаването на данни.'
          }
        ]
      }
    ]
  }
];

export const MISSIONS_DAILY: DailyMission[] = [
  {
    id: 'd1',
    title: 'Научи как работят AI агентите',
    description: 'Завърши урока „AI Агенти" от Модул 1.',
    xp: 50,
    action: 'Започни'
  },
  {
    id: 'd2',
    title: 'Ревизирай 5 флашкарти',
    description: 'Прегледай флашкарти и затвърди знанията си.',
    xp: 25,
    action: 'Ревизирай'
  },
  {
    id: 'd3',
    title: 'Запази 3 нови prompt-а',
    description: 'Разгледай Prompt Library и запази 3 полезни prompt-а.',
    xp: 30,
    action: 'Към Prompt-ите'
  }
];

export const FLASHCARDS: Flashcard[] = [
  { id: 'f1', front: 'Какво е Prompt?', back: 'Инструкция към AI модел.', moduleId: 'm1' },
  { id: 'f2', front: 'Какво прави LLM?', back: 'Предвижда следващата дума в последователност.', moduleId: 'm1' },
  { id: 'f3', front: 'Какво е AI агент?', back: 'Система, която изпълнява многостъпкови задачи автономно.', moduleId: 'm1' },
  { id: 'f4', front: 'Какво е тригер в автоматизация?', back: 'Събитие, което стартира workflow.', moduleId: 'm1' },
  { id: 'f5', front: 'Какво е роля в prompt?', back: 'Задава перспективата или експертизата, която AI трябва да използва.', moduleId: 'm1' },
  { id: 'f6', front: 'Кое е предимство на AI за съдържание?', back: 'Ускорява production и дава варианти за чернови.', moduleId: 'm2' },
  { id: 'f7', front: 'Как AI помага при анализ?', back: 'Обобщава големи количества информация и намира тенденции.', moduleId: 'm2' },
  { id: 'f8', front: 'Какво е workflow?', back: 'Последователност от стъпки, която превръща вход в изход.', moduleId: 'm2' }
];

export const MISSIONS_BADGES: MissionBadgeDef[] = [
  { id: 'firstLesson', title: 'Първи урок', description: 'Завърши първия урок в Мисии.', icon: '🏆', condition: 'firstLesson' },
  { id: 'streak7', title: '7 дневен стрийк', description: 'Учи 7 поредни дни.', icon: '🔥', condition: 'streak7' },
  { id: 'xp100', title: '100 XP', description: 'Събери 100 XP от мисии.', icon: '⭐', condition: 'xp100' },
  { id: 'moduleComplete', title: 'Завършен модул', description: 'Завърши цял модул.', icon: '🎓', condition: 'moduleComplete' },
  { id: 'referrals5', title: 'Поканил 5 приятели', description: 'Сподели платформата с 5 приятели.', icon: '🤝', condition: 'referrals5' },
  { id: 'streak30', title: '30 дневен стрийк', description: 'Учи 30 поредни дни.', icon: '👑', condition: 'streak30' }
];

export const XP_REWARDS = {
  lessonCompleted: 20,
  quizCompleted: 30,
  flashcardReviewed: 5,
  dailyMission: 50,
  referral: 50,
  wrongAnswer: 5,
};
