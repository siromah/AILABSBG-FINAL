export const INIT_USERS = [
  {id:'u1',fname:'Мария',lname:'Георгиева',email:'maria@demo.com',pass:'demo123',role:'freelancer',bio:'Freelancer в digital marketing. Използвам AI всеки ден.',color:'#fff3ee',tc:'#b84a15',initials:'МГ',isAdmin:false,joined:'2024-01-15',tools:['ChatGPT','Claude','Canva AI']},
  {id:'u2',fname:'Стефан',lname:'Димитров',email:'stefan@demo.com',pass:'demo123',role:'business',bio:'E-commerce founder. Автоматизирам всичко с Make.com.',color:'#eef4ff',tc:'#1f5aad',initials:'СД',isAdmin:false,joined:'2024-02-10',tools:['ChatGPT','Make.com','Perplexity']},
  {id:'u3',fname:'Виктория',lname:'Николова',email:'victoria@demo.com',pass:'demo123',role:'creator',bio:'Content creator. AI content системи.',color:'#eefbf4',tc:'#157a4d',initials:'ВН',isAdmin:false,joined:'2024-03-05',tools:['Claude','Midjourney','ElevenLabs']},
  {id:'admin',fname:'Админ',lname:'AILABSBG',email:'admin@ailabsbg.com',pass:'admin123',role:'admin',bio:'Основател на AILABSBG.',color:'#fff3ee',tc:'#b84a15',initials:'АИ',isAdmin:true,joined:'2024-01-01',tools:['Claude','ChatGPT','Midjourney','Make.com']}
];

export const INIT_POSTS = [
  {id:'p1',uid:'u1',type:'win',text:'Изградих automation за email sequences с Make.com + Claude. Спестявам 8 часа седмично. Споделям workflow-а в коментарите.',tags:['Automation','Make.com','Win'],likes:['u2'],saved:[],comments:[{id:'c1',uid:'u2',text:'Браво! Как е структуриран trigger-ът? Имаш ли шаблон?',time:Date.now()-3600000}],time:Date.now()-600000,pinned:true},
  {id:'p2',uid:'u2',type:'question',text:'Как пишете system prompt за Claude за customer support? Имам e-commerce бизнес и търся идеи. Някой пробвал ли е?',tags:['Claude','Customer Support'],likes:['u1'],saved:[],comments:[{id:'c2',uid:'admin',text:'Виж Prompt Library-то — има готов template за Customer Support AI!',time:Date.now()-3000000}],time:Date.now()-3600000,pinned:false}
];

export const INIT_NOTIFS = [
  {id:'n1',text:'Мария хареса твоя пост',icon:'heart',time:Date.now()-300000,read:false},
  {id:'n2',text:'Нов коментар от Стефан',icon:'message',time:Date.now()-900000,read:false}
];

export const PROMPTS = [
  {id:'pr1',title:'Email sequence automation',cat:'automation',text:'Напиши 5-стъпкова email nurture sequence за [продукт/услуга]. Всеки email трябва да е фокусиран върху конкретна болка на клиента. Тон: приятелски и professional. Включи subject lines.',saves:4},
  {id:'pr2',title:'Instagram caption generator',cat:'content',text:'Ти си expert social media copywriter. Напиши 5 Instagram caption варианта за [тема]. Тонът трябва да е [описание]. Включи CTA. Максимум 150 думи.',saves:7},
  {id:'pr3',title:'Meeting summary builder',cat:'productivity',text:'Ти си executive assistant. Ето notes от среща: [notes]. Напиши чист summary с: 1) Основни решения 2) Action items с отговорни и дедлайни 3) Следваща стъпка.',saves:3},
  {id:'pr4',title:'Customer support response',cat:'business',text:'Ти си friendly customer support agent за [компания]. Клиент пише: "[съобщение]". Напиши empathetic отговор, предложи решение, и предложи follow-up. Тон: топъл и professional.',saves:2},
  {id:'pr5',title:'Blog post outline creator',cat:'marketing',text:'Напиши детайлен outline за blog post на тема: [тема]. Включи: compelling hook, 5-7 main sections с подточки, key takeaways и CTA. Target audience: [аудитория].',saves:3},
  {id:'pr6',title:'Make.com automation plan',cat:'automation',text:'Помогни ми да опиша automation workflow за Make.com. Имам [входящи данни] и искам да получа [резултат]. Какви modules трябва да използвам и в какъв ред?',saves:2},
  {id:'pr7',title:'Cold email outreach',cat:'marketing',text:'Напиши personalized cold email за [prospect]. Те работят в [индустрия] и имат [проблем]. Нашето решение е [решение]. Email трябва да е кратък (150 думи), без buzzwords, с един clear CTA.',saves:4},
  {id:'pr8',title:'Competitor analysis',cat:'business',text:'Направи анализ на [конкурент]. Включи: техните strengths и weaknesses, positioning, target audience, pricing strategy, и как можем да се диференцираме.',saves:1},
  {id:'pr9',title:'Daily AI productivity plan',cat:'productivity',text:'Помогни ми да планирам деня си с AI. Имам следните задачи: [задачи]. Приоритизирай ги, предложи кои могат да се автоматизират с AI, и създай time-blocked schedule.',saves:5},
  {id:'pr10',title:'TikTok script writer',cat:'content',text:'Напиши TikTok script за видео на тема [тема]. Включи: hook (първите 3 секунди), основно съдържание, и strong ending. Продължителност: [секунди]. Тон: [описание].',saves:4},
  {id:'pr11',title:'Product description e-commerce',cat:'marketing',text:'Напиши compelling product description за [продукт]. Включи: главна headline, 3 key benefits, technical specs, и CTA. Target customer: [описание]. Tone: [tone].',saves:2},
  {id:'pr12',title:'Meeting agenda creator',cat:'productivity',text:'Създай agenda за [вид среща] с [хора] за [продължителност]. Целта на срещата: [цел]. Включи timeboxing за всяка точка и кой е responsible.',saves:1}
];

export const LESSONS_MODS = [
  {title:'Ден 1 — AI Foundations',lessons:[
    {id:'l1',title:'Въведение в AI инструментите',dur:'12 мин',h:'Въведение в AI инструментите',p1:'В този урок ще разгледаме основните AI инструменти — ChatGPT, Claude и Gemini. Ще разберем разликите между тях и кога да използваме кой.',p2:'ChatGPT е най-популярният и добър за general tasks. Claude е по-нюансиран и подходящ за дълги анализи и business задачи. Gemini се интегрира добре с Google Workspace.',p3:'Ключовото разбиране: различните AI инструменти имат различни strengths. Истинският power идва, когато знаеш кога да използваш кой.'},
    {id:'l2',title:'Prompt Engineering основи',dur:'18 мин',h:'Prompt Engineering основи',p1:'Prompt engineering е изкуството да комуникираш ефективно с AI. Добрият prompt е ясен, конкретен и дава context.',p2:'Структурата на добрия prompt: Роля + Задача + Context + Формат + Ограничения. Например: "Ти си expert copywriter. Напиши email за [клиент]. Тонът трябва да е professional. Максимум 200 думи."',p3:'Практическо упражнение: Вземи задача, която имаш тази седмица, и напиши prompt по тази структура. Сравни резултатите с и без структурата.'},
    {id:'l3',title:'AI Productivity System',dur:'22 мин',h:'AI Productivity System',p1:'Вместо да отваряш ChatGPT random, трябва да изградиш система. AI Productivity System е набор от готови prompts, workflows и навици.',p2:'Компонентите: 1) Prompt Library с твоите най-използвани prompts 2) Daily AI habits 3) Template библиотека 4) Output review процес.',p3:'Инструменти: Notion за организиране на prompts, ChatGPT за изпълнение, Perplexity за research. Ключово: всеки ден прави 3 неща с AI, дори малки.'},
    {id:'l4',title:'ChatGPT vs Claude vs Gemini',dur:'15 мин',h:'ChatGPT, Claude и Gemini — кога какво да използваш',p1:'Всеки AI модел има своите strengths. Разбирането на тези разлики ти дава огромно предимство.',p2:'ChatGPT: най-добър за creative writing, coding, и general tasks. Claude: най-добър за дълги анализи, business writing, и nuanced задачи. Gemini: най-добър за Google integration и multimodal tasks.',p3:'Практика: Тази седмица използвай само един tool и научи limits-ите му. Следващата седмица опитай друг за същите задачи. Разликата ще те изненада.'},
    {id:'l5',title:'AI Workflows 101',dur:'20 мин',h:'AI Workflows 101',p1:'Workflow е последоватателност от AI-assisted стъпки, която превръща input в output по предсказуем начин.',p2:'Пример за content workflow: Research (Perplexity) → Outline (Claude) → Draft (ChatGPT) → Edit (Claude) → Image (Midjourney) → Publish.',p3:'Защо workflows са важни: Повтаряемост. Качество. Скорост. Когато workflow-ът е готов, можеш да го делегираш или автоматизираш.'}
  ]},
  {title:'Ден 2 — Content & Automation',lessons:[
    {id:'l6',title:'AI Content System',dur:'25 мин',h:'AI Content System',p1:'AI Content System е набор от workflows, templates и processes, които позволяват да произвеждаш повече content с по-малко усилие.',p2:'Компонентите: Content Calendar AI, Repurposing workflows, Voice/Tone consistency, Bulk creation strategies.',p3:'Начало: Документирай как правиш content сега. После добави AI на всяка стъпка. Накрая имаш система.'},
    {id:'l7',title:'Automation с Make.com',dur:'30 мин',h:'Automation с Make.com',p1:'Make.com (бивш Integromat) е visual automation builder. Позволява да свързваш AI tools без код.',p2:'Основни концепции: Triggers (кое задейства automation), Modules (какво се прави), Routing (условия), Data Stores.',p3:'Първи проект: Вземи email от клиент → Claude анализира sentiment → ако е negative, изпраща alert в Slack. 30 минути работа.'},
    {id:'l8',title:'Social Media AI Workflows',dur:'18 мин',h:'Social Media AI Workflows',p1:'Social media изисква постоянен content. AI може да намали времето за production с 70%.',p2:'Workflow: 1 long-form piece → AI repurpose в 5 platforms. Пример: Blog post → LinkedIn article → Twitter thread → Instagram carousel → TikTok script.',p3:'Ключово: AI не замества твоята "voice". AI ускорява production, ти добавяш authentic perspective.'},
    {id:'l9',title:'AI Agents — следващото ниво',dur:'22 мин',h:'AI Agents — следващото ниво',p1:'AI agents са системи, където AI може да взима решения и да изпълнява multi-step tasks автономно.',p2:'Примери: Research agent, Customer service agent, Content creation agent. Инструменти: GPT-4, Claude API, AutoGPT, AgentGPT.',p3:'Важно: Agents не са magic. Те изискват добра архитектура и oversight. Започни с прости use cases.'},
    {id:'l10',title:'Video AI Tools',dur:'16 мин',h:'Video AI Tools',p1:'Video content е бъдещето. AI прави video production достъпно за всеки.',p2:'Tools: ElevenLabs (voice cloning), Heygen (AI avatars), Runway (video editing), Descript (transcription + editing), Pika (text-to-video).',p3:'Workflow: Script (Claude) → Voice (ElevenLabs) → Visuals (Runway/Midjourney) → Edit (Descript) → Publish.'}
  ]},
  {title:'Ден 3 — Business AI Systems',lessons:[
    {id:'l11',title:'AI за продажби',dur:'24 мин',h:'AI за продажби и business development',p1:'AI може да трансформира sales процеса — от lead research до email follow-up.',p2:'Use cases: Lead scoring, Personalized outreach, Meeting prep, Proposal writing, Objection handling scripts.',p3:'Пример: Преди среща → AI research на компанията и contact-а → Personalized agenda → Follow-up email template готов.'},
    {id:'l12',title:'Customer Support AI',dur:'19 мин',h:'Customer Support AI',p1:'AI може да обработва 70% от customer queries автоматично, оставяйки сложните cases за хора.',p2:'Архитектура: FAQ база → Claude API → Routing logic → Human escalation. Инструменти: Intercom, Zendesk, custom.',p3:'Важно: AI трябва да знае кога да каже "не знам" и да ескалира. Никога не лъже клиента.'},
    {id:'l13',title:'Business Automation Stack',dur:'27 мин',h:'Business Automation Stack',p1:'Automation Stack е съвкупността от tools и workflows, които автоматизират твоя бизнес.',p2:'Layers: Data (Airtable/Notion) → Automation (Make.com/Zapier) → AI (Claude API/OpenAI) → Communication (Email/Slack) → Analytics.',p3:'Принцип: Автоматизирай repetitive first. После complex. После exceptions.'},
    {id:'l14',title:'Scaling с AI',dur:'21 мин',h:'Scaling workflows с AI',p1:'Scaling означава повече output с по-малко пропорционален input. AI е leverage.',p2:'Стратегии: Templatize всичко, Automate repetitive, Delegate decisions на AI, Measure и optimize.',p3:'Mindset shift: Не питай "как мога да направя X?" Питай "как мога да направя 10x X с AI?"'},
    {id:'l15',title:'Твоят AI Roadmap',dur:'15 мин',h:'Твоят AI Business Roadmap',p1:'Последен урок: как да продължиш напред след intensive-а.',p2:'90-day plan: 30 дни — основни инструменти и habits. 60 дни — първа automation. 90 дни — measurable time savings.',p3:'Community е тук за теб. Задавай въпроси, споделяй wins, помагай на другите. Успех!'}
  ]}
];

export const EVENTS_DATA = [
  {id:'e1',day:'13',mo:'Юни',title:'AI Workflow Q&A',desc:'Live сесия с нашия екип. Задавайте въпроси за workflows, automation и AI tools.',time:'19:00ч',dur:'90 мин',platform:'Zoom',spots:20},
  {id:'e2',day:'15',mo:'Юни',title:'Live: Prompt Engineering с Claude',desc:'Ще напишем заедно system prompts за различни бизнес use cases.',time:'18:30ч',dur:'60 мин',platform:'Zoom',spots:25},
  {id:'e3',day:'17',mo:'Юни',title:'Make.com Automation Workshop',desc:'Практическо workshop — изграждаме реална automation от нула.',time:'11:00ч',dur:'120 мин',platform:'Zoom',spots:15},
  {id:'e4',day:'20',mo:'Юни',title:'AI за e-commerce: Office Hours',desc:'Специализирана сесия за e-commerce бизнеси. Customer support AI, order automation.',time:'17:00ч',dur:'90 мин',platform:'Zoom',spots:18},
  {id:'e5',day:'22',mo:'Юни',title:'Content AI Masterclass',desc:'Как да изградиш пълна AI content система за social media.',time:'19:00ч',dur:'90 мин',platform:'Zoom',spots:30}
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    desc: 'За разглеждане, newsletter и основни ресурси.',
    monthly: 0,
    yearly: 0,
    features: ['Достъп до 3 урока', 'Четене в общността', 'Основни prompts', 'Имейл новини']
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'Community, workshops, prompt library, templates и challenges.',
    monthly: 9,
    yearly: 90,
    features: ['Всички уроци в Академията', 'Публикуване в общността', 'Всички prompts', 'Workshops и шаблони', 'Седмични challenges', 'Приоритетна поддръжка']
  },
  {
    id: 'premium',
    name: 'Premium',
    desc: 'Pro плюс office hours, implementation reviews и priority Q&A.',
    monthly: 24,
    yearly: 240,
    features: ['Всичко от Pro', 'Office hours на живо', 'Implementation reviews', 'Priority Q&A', 'Директен достъп до екипа', 'Персонализирани съвети']
  }
];
