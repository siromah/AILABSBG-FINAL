import React from 'react';

const LegalLayout = ({ title, children }: any) => (
  <div className="min-h-screen text-[var(--text-primary)] grain py-16 md:py-20">
    <div className="section-shell max-w-3xl">
      <div className="premium-card p-8 md:p-12">
        <h1 className="display-lg text-[var(--ink-900)] mb-8">
          {title}
        </h1>
        <div className="text-[15px] leading-relaxed text-[var(--text-secondary)] space-y-6">
          <div className="bg-[var(--amber-light)] border border-[var(--amber)]/20 px-5 py-4 rounded-xl text-[14px] text-[var(--amber-text)] mb-8">
            <strong>Отказ от отговорност:</strong> Това съдържание е технически прототип и не представлява официален правен документ. Трябва да бъде прегледано от юристи преди публично стартиране.
          </div>
          {children}
        </div>
      </div>
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <LegalLayout title="Политика за поверителност">
    <p>Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">1. Кои сме ние?</h3>
    <p>Този сайт се управлява от Craative и служи като концептуална платформа. Тази политика обяснява как събираме и използваме вашите данни при използване на нашите услуги.</p>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">2. Какви данни събираме</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Профилни данни:</strong> Имена, имейл адрес и професионална роля при регистрация.</li>
      <li><strong>Съдържание:</strong> Публикации, коментари и запазени prompts във вашата потребителска сесия.</li>
      <li><strong>Технически данни:</strong> IP адрес, бисквитки и аналитична информация само при изрично съгласие.</li>
    </ul>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">3. Цел на обработката</h3>
    <p>Използваме вашите данни, за да:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>Осигурим функционирането на платформата (напр. потребителски вход).</li>
      <li>Подобрим учебните материали и общността чрез обобщена статистика.</li>
      <li>Изпращаме важни системни известия.</li>
    </ul>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">4. Вашите GDPR права</h3>
    <p>Съгласно Регламент (ЕС) 2016/679 (GDPR), имате право на достъп, коригиране, изтриване и преносимост на вашите данни. Можете да оттеглите съгласието си по всяко време.</p>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">5. Свържете се с нас</h3>
    <p>Запитвания относно поверителност: <a href="mailto:privacy@ailabsbg.demo" className="text-[var(--accent)] hover:underline font-medium">privacy@ailabsbg.demo</a></p>
  </LegalLayout>
);

export const CookiePolicy = () => (
  <LegalLayout title="Политика за бисквитки">
    <p>Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">1. Какво са бисквитките?</h3>
    <p>Бисквитките са малки текстови файлове, които се запазват на вашето устройство при посещение на уебсайт. Използваме бисквитки и local storage, за да осигурим безпроблемната работа на платформата.</p>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">2. Видове бисквитки, които използваме</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Строго необходими:</strong> Задължителни за работата на сайта (напр. запазване на сесия, тема). Не могат да бъдат изключени.</li>
      <li><strong>Аналитични (по избор):</strong> Помагат ни да разберем как посетителите взаимодействат със сайта.</li>
      <li><strong>Маркетингови (по избор):</strong> Използват се за проследяване между различни сайтове за показване на релевантни реклами.</li>
    </ul>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">3. Управление на предпочитания</h3>
    <p>Можете да промените настройките си за бисквитки по всяко време чрез бутона "Настройки".</p>
  </LegalLayout>
);

export const TermsOfUse = () => (
  <LegalLayout title="Условия за ползване">
    <p>Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">1. Приемане на условията</h3>
    <p>С достъпването и използването на Craative се съгласявате с тези Условия за ползване. Това е платформа за обучение и професионална общност.</p>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">2. Потребителски акаунти и съдържание</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li>Вие сте отговорни за запазването на конфиденциалността на вашата парола.</li>
      <li>Съдържанието, което споделяте в секцията "Общност", не трябва да нарушава закона, авторските права или да обижда други потребители.</li>
    </ul>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">3. Интелектуална собственост</h3>
    <p>Всички учебни материали, текстове, дизайни и графики на платформата са собственост на Craative, освен ако не е посочено друго. Потребителските prompts остават собственост на своите създатели, но се показват в рамките на платформата.</p>

    <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mt-10 mb-3">4. Ограничение на отговорността</h3>
    <p>Платформата и AI интеграциите се предоставят "както са". Не носим отговорност за щети, произтичащи от използването или невъзможността за използване на материалите. AI генерираното съдържание трябва да бъде проверено, тъй като не гарантираме неговата точност.</p>
  </LegalLayout>
);
