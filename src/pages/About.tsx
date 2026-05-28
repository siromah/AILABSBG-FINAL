import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, Zap, Briefcase, ArrowRight, BookOpen, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BackgroundMedia } from '../components/BackgroundMedia';

export default function About({ openModal }: any) {
  return (
    <div className="min-h-screen text-[var(--text-primary)] grain">

      {/* HERO with background media */}
      <BackgroundMedia
        imageSrc="/media/learning-bg.jpg"
        overlayClassName="bg-gradient-to-b from-black/50 via-black/30 to-[var(--bg)]"
        className="relative"
      >
        <div className="section-shell pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="accent" className="mb-5 rounded-full">Нашата мисия</Badge>
              <h1 className="display-lg text-white mb-5">
                AI грамотност за<br />
                <span className="text-white/90">реална Европа.</span>
              </h1>
              <p className="text-[17px] text-white/70 max-w-xl leading-relaxed">
                Помагаме на професионалисти и малки екипи да усвоят AI умения, които водят до реални резултати — по-бързи workflows, по-добри решения, повече време за важното.
              </p>
            </motion.div>
          </div>
        </div>
      </BackgroundMedia>

      <div className="section-shell">
        <div className="soft-divider" />
      </div>

      {/* MISSION STATEMENT */}
      <section className="section-shell py-14 md:py-20">
        <motion.div initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration: 0.5}}>
          <div className="premium-card p-6 md:p-10 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
                  <Target size={20} />
                </div>
                <h2 className="text-[22px] md:text-[26px] font-semibold text-[var(--ink-900)] tracking-tight">Проблемът, който решаваме</h2>
              </div>

              <div className="space-y-5 text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                <p>
                  Има твърде много шум около AI и твърде малко практически умения. Хората отварят ChatGPT, задават въпрос, получават среден отговор и спират дотам. Пропускат се системните prompts, ясните workflows и дълбокото разбиране на възможностите.
                </p>
                <p>
                  Затова създадохме AILABS — място, където проверени практики, структурирани уроци и общност от съмишленици се срещат. Без маркетингов шум, без фалшиви обещания. Само работещи инструменти и хора, които ги използват всеки ден.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="section-shell">
        <div className="soft-divider" />
      </div>

      {/* WHO IS THIS FOR */}
      <section className="section-shell py-14 md:py-20">
        <div className="mb-10">
          <span className="label-caps mb-3 block">Аудитория</span>
          <h2 className="display-md text-[var(--ink-900)] mb-3">За кого е AILABS?</h2>
          <p className="text-[16px] text-[var(--text-secondary)] max-w-lg">Създадена за професионалисти, които изграждат реална промяна.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration: 0.4, delay: 0.05}}>
            <div className="premium-card p-6 h-full">
              <div className="w-10 h-10 rounded-xl bg-[var(--amber-light)] text-[var(--amber)] flex items-center justify-center mb-4">
                <Briefcase size={20} />
              </div>
              <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2 tracking-tight">Предприемачи</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Оптимизирайте операциите, мащабирайте съдържанието и изграждайте автоматизации, които освобождават време за стратегия.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration: 0.4, delay: 0.1}}>
            <div className="premium-card p-6 h-full">
              <div className="w-10 h-10 rounded-xl bg-[var(--emerald-light)] text-[var(--emerald)] flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2 tracking-tight">Маркетолози и криейтъри</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Генерирайте по-силни идеи, анализирайте данни и ускорявайте кампаниите си с AI workflows.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration: 0.4, delay: 0.15}}>
            <div className="premium-card p-6 h-full">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2 tracking-tight">Екипи</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Изграждайте споделени бази знания и вътрешни AI инструменти, които увеличават продуктивността на целия екип.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-shell">
        <div className="soft-divider" />
      </div>

      {/* VALUES */}
      <section className="section-shell py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <span className="label-caps mb-3 block">Стойности</span>
            <h2 className="display-md text-[var(--ink-900)] mb-8">Как работим</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-soft)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0 mt-0.5">
                  <BookOpen size={17} />
                </div>
                <div>
                  <h4 className="text-[16px] font-semibold text-[var(--ink-900)] mb-1">Практическо обучение</h4>
                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">Всяка концепция се прилага веднага. Теорията е минимум, действието — максимум.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-soft)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0 mt-0.5">
                  <MapPin size={17} />
                </div>
                <div>
                  <h4 className="text-[16px] font-semibold text-[var(--ink-900)] mb-1">Български контекст</h4>
                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">Уроци и примери, които работят в реалния български бизнес контекст.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-soft)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0 mt-0.5">
                  <Clock size={17} />
                </div>
                <div>
                  <h4 className="text-[16px] font-semibold text-[var(--ink-900)] mb-1">Реално време за резултат</h4>
                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">Фокусираме се върху умения, които дават измерима полза в рамките на седмици, не месеци.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="premium-card p-6 md:p-8 flex flex-col justify-center">
            <h3 className="text-[20px] font-semibold text-[var(--ink-900)] mb-4">За платформата</h3>
            <div className="space-y-4 text-[15px] text-[var(--text-secondary)] leading-relaxed">
              <p>AILABSBG е създадена с ясна цел: да намали разстоянието между обещанията на AI индустрията и реалните умения, които професионалистите в България и ЕС могат да приложат в работата си.</p>
              <p>Вярваме, че AI не е заместител на човешкото мислене, а инструмент, който увеличава способността ни да създаваме, решаваме и растем.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-shell">
        <div className="soft-divider" />
      </div>

      {/* CTA */}
      <section className="section-shell py-14 md:py-20 pb-20">
        <motion.div initial={{opacity:0, scale:0.98}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{duration: 0.4}}>
          <div className="relative rounded-[32px] bg-[var(--ink-900)] text-[var(--bg)] overflow-hidden p-10 md:p-14">
             <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent)] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-56 h-56 bg-[var(--emerald)] rounded-full opacity-8 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
             <div className="relative z-10 flex flex-col items-start max-w-xl">
               <h2 className="text-[28px] md:text-[38px] font-semibold mb-4 tracking-tight leading-tight">Готови ли сте да изграждате с AI?</h2>
               <p className="text-[16px] text-[var(--bg)]/60 mb-8 leading-relaxed">
                 Присъединете се към общност от професионалисти, които учат, тестват и споделят реални AI workflows.
               </p>
               <Button size="lg" onClick={() => openModal('signup')} className="gap-2 px-7 h-12 bg-[var(--bg)] text-[var(--ink-900)] hover:bg-[var(--bg-soft)] text-[15px]">
                 Присъединете се <ArrowRight size={16} />
               </Button>
             </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
