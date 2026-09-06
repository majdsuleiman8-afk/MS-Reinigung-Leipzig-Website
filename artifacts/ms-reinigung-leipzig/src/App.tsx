import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, Facebook, HeartHandshake, Mail, Menu, Phone, ShieldCheck, Sparkles, Star, UsersRound, X, Instagram } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const logoPath = '/assets/ms-reinigung-logo.jpg';

type Language = 'de' | 'ar' | 'en';
type Copy = {
  nav: { services: string; why: string; process: string; contact: string; cta: string };
  hero: { kicker: string; title: string; accent: string; body: string; primary: string; secondary: string; note: string; badge: string };
  trust: string[];
  services: { label: string; title: string; intro: string; cards: { title: string; body: string }[] };
  story: { label: string; title: string; body: string; principles: { title: string; body: string }[] };
  process: { label: string; title: string; body: string; steps: { title: string; body: string }[] };
  testimonial: { label: string; title: string; quote: string; person: string; detail: string };
  contact: { label: string; title: string; body: string; formTitle: string; name: string; email: string; phone: string; service: string; message: string; placeholderName: string; placeholderEmail: string; placeholderPhone: string; placeholderMessage: string; choose: string; send: string; success: string; };
  footer: { tagline: string; explore: string; reach: string; legal: string; rights: string };
};

const copy: Record<Language, Copy> = {
  de: {
    nav: { services: 'Leistungen', why: 'Warum M.S?', process: 'So geht’s', contact: 'Kontakt', cta: 'Termin anfragen' },
    hero: { kicker: 'Reinigung mit Haltung · Leipzig', title: 'Sauberkeit, die', accent: 'Vertrauen schafft.', body: 'Wir kümmern uns um Räume, in denen Menschen leben, arbeiten und ankommen. Verlässlich, gründlich und mit dem Blick fürs Detail.', primary: 'Kostenlos anfragen', secondary: 'Direkt anrufen', note: 'Antwort meist am selben Werktag', badge: 'Sorgfalt, die man spürt' },
    trust: ['Pünktlich & persönlich', 'Faire, klare Preise', 'Leipzig & Umgebung'],
    services: { label: 'Unsere Leistungen', title: 'Mehr als sauber. Genau richtig für Ihren Raum.', intro: 'Ob Zuhause, Büro oder nach einem Umzug: Wir bringen Ordnung und Frische zurück — mit festen Ansprechpartnern und einem Ergebnis, das bleibt.', cards: [
      { title: 'Wohnungsreinigung', body: 'Für ein Zuhause, das sich leicht und gut anfühlt — regelmäßig oder einmalig.' },
      { title: 'Büro & Gewerbe', body: 'Arbeitsplätze, Praxen und Gewerbeflächen, die Professionalität ausstrahlen.' },
      { title: 'Fensterreinigung', body: 'Klare Aussichten, streifenfrei und sorgfältig bis in die Ecken.' },
      { title: 'Umzugsreinigung', body: 'Sauber übergeben oder entspannt einziehen — wir machen den Übergang leichter.' },
      { title: 'Grundreinigung', body: 'Wenn ein Raum einen echten Neustart verdient.' },
      { title: 'Regelmäßige Pflege', body: 'Ihr Rhythmus, unser verlässlicher Plan. Wöchentlich, 14-tägig oder nach Bedarf.' },
    ] },
    story: { label: 'Warum M.S Reinigung', title: 'Ein gutes Gefühl beginnt mit einem guten Team.', body: 'Wir sind ein lokales Reinigungsteam aus Leipzig. Für uns bedeutet Reinigung nicht nur, sichtbaren Schmutz zu entfernen. Es bedeutet, Verantwortung zu übernehmen — für Ihre Zeit, Ihre Räume und Ihr Vertrauen.', principles: [
      { title: 'Liebe zum Detail', body: 'Wir sehen auch das, was andere übersehen.' },
      { title: 'Verbindliche Abläufe', body: 'Absprachen werden bei uns eingehalten.' },
      { title: 'Menschlich & respektvoll', body: 'Ihre Räume, Ihre Regeln, unser Respekt.' },
      { title: 'Hochwertige Mittel', body: 'Wir wählen wirksame Produkte mit Bedacht.' },
    ] },
    process: { label: 'So buchen Sie', title: 'Drei Schritte zu einem Raum, der aufatmet.', body: 'Unkompliziert starten, transparent planen, zuverlässig ankommen.', steps: [
      { title: 'Kontakt aufnehmen', body: 'Rufen Sie uns an oder senden Sie eine kurze Anfrage. Wir hören zu.' },
      { title: 'Termin & Angebot', body: 'Wir besprechen Ihren Bedarf und finden einen passenden Termin.' },
      { title: 'Sauber ankommen', body: 'Unser Team arbeitet sorgfältig — Sie genießen das Ergebnis.' },
    ] },
    testimonial: { label: 'Was Kundinnen sagen', title: 'Ordnung, die bleibt.', quote: '„Endlich eine Reinigung, bei der wirklich mitgedacht wird. Die Kommunikation war herzlich, der Termin pünktlich und die Wohnung danach einfach wunderbar.“', person: 'Maria K.', detail: 'Privathaushalt · Leipzig-Süd' },
    contact: { label: 'Ihr nächster Schritt', title: 'Lassen Sie uns anfangen.', body: 'Erzählen Sie uns kurz, was Sie brauchen. Wir melden uns persönlich mit den nächsten Schritten — ohne Umwege und ohne Verpflichtung.', formTitle: 'Anfrage senden', name: 'Name', email: 'E-Mail', phone: 'Telefon', service: 'Gewünschte Leistung', message: 'Ihre Nachricht', placeholderName: 'Wie dürfen wir Sie nennen?', placeholderEmail: 'ihre@email.de', placeholderPhone: '+49 ...', placeholderMessage: 'Zum Beispiel: 3-Zimmer-Wohnung, einmalig im Mai …', choose: 'Bitte auswählen', send: 'Anfrage abschicken', success: 'Vielen Dank — Ihre Anfrage ist angekommen. Wir melden uns schnellstmöglich persönlich bei Ihnen.' },
    footer: { tagline: 'Eine Berührung Sauberkeit, ein Zeichen von Vertrauen.', explore: 'Entdecken', reach: 'Erreichen Sie uns', legal: 'Impressum · Datenschutz', rights: 'M.S Reinigung · Leipzig' },
  },
  ar: {
    nav: { services: 'خدماتنا', why: 'لماذا M.S؟', process: 'كيف نعمل', contact: 'تواصل معنا', cta: 'اطلب موعداً' },
    hero: { kicker: 'تنظيف باهتمام · لايبزيغ', title: 'نظافة تبني', accent: 'الثقة.', body: 'نعتني بالأماكن التي تعيشون وتعملون وتستريحون فيها. خدمة موثوقة، دقيقة، وإنسانية حتى أدق التفاصيل.', primary: 'اطلب عرضاً مجانياً', secondary: 'اتصل بنا مباشرة', note: 'نرد غالباً في يوم العمل نفسه', badge: 'عناية تشعرون بها' },
    trust: ['التزام وشخصية', 'أسعار واضحة وعادلة', 'لايبزيغ والمناطق القريبة'],
    services: { label: 'خدماتنا', title: 'ليست نظافة فقط. بل عناية تناسب مساحتكم.', intro: 'للمنزل أو المكتب أو بعد الانتقال: نعيد النظام والانتعاش إلى مساحتكم، مع شخص مسؤول ونتيجة يمكن الوثوق بها.', cards: [
      { title: 'تنظيف المنازل', body: 'لمنزل تشعرون فيه بالراحة — بشكل منتظم أو لمرة واحدة.' },
      { title: 'المكاتب والأعمال', body: 'أماكن عمل وعيادات ومساحات تجارية تعكس احترافيتكم.' },
      { title: 'تنظيف النوافذ', body: 'إطلالة واضحة ونوافذ بلا آثار، بعناية حتى الزوايا.' },
      { title: 'تنظيف الانتقال', body: 'تسليم نظيف أو انتقال هادئ — نجعل المرحلة أسهل.' },
      { title: 'التنظيف العميق', body: 'عندما تستحق الغرفة بداية جديدة حقيقية.' },
      { title: 'العناية الدورية', body: 'إيقاعكم، وخطتنا الموثوقة. أسبوعياً أو كل أسبوعين أو حسب الحاجة.' },
    ] },
    story: { label: 'لماذا M.S Reinigung', title: 'الشعور الجيد يبدأ بفريق جيد.', body: 'نحن فريق تنظيف محلي من لايبزيغ. بالنسبة لنا، التنظيف ليس إزالة الأوساخ الظاهرة فقط، بل هو مسؤولية تجاه وقتكم ومساحتكم وثقتكم بنا.', principles: [
      { title: 'اهتمام بالتفاصيل', body: 'نلاحظ أيضاً ما قد يتجاهله الآخرون.' },
      { title: 'مواعيد واضحة', body: 'نلتزم دائماً بما نتفق عليه.' },
      { title: 'إنسانية واحترام', body: 'مساحتكم وقواعدكم محل احترامنا.' },
      { title: 'مواد عالية الجودة', body: 'نختار منتجات فعالة بعناية.' },
    ] },
    process: { label: 'طريقة الحجز', title: 'ثلاث خطوات لمساحة تتنفس.', body: 'بداية بسيطة، تخطيط واضح، ووصول في الموعد.', steps: [
      { title: 'تواصلوا معنا', body: 'اتصلوا بنا أو أرسلوا طلباً قصيراً. نحن نستمع لاحتياجكم.' },
      { title: 'موعد وعرض', body: 'نناقش التفاصيل ونجد الموعد المناسب لكم.' },
      { title: 'نظافة موثوقة', body: 'يعمل فريقنا بعناية، وتستمتعون بالنتيجة.' },
    ] },
    testimonial: { label: 'آراء عملائنا', title: 'ترتيب يدوم.', quote: '«أخيراً خدمة تنظيف تهتم بالتفاصيل فعلاً. التواصل لطيف، الموعد دقيق، والمنزل بعد ذلك رائع بكل معنى الكلمة.»', person: 'ماريا ك.', detail: 'منزل خاص · جنوب لايبزيغ' },
    contact: { label: 'خطوتكم التالية', title: 'لنبدأ معاً.', body: 'أخبرونا باختصار بما تحتاجونه. سنتواصل معكم شخصياً بالخطوات التالية — ببساطة وبدون التزام.', formTitle: 'إرسال طلب', name: 'الاسم', email: 'البريد الإلكتروني', phone: 'الهاتف', service: 'الخدمة المطلوبة', message: 'رسالتكم', placeholderName: 'كيف يمكننا مناداتكم؟', placeholderEmail: 'email@example.com', placeholderPhone: '+49 ...', placeholderMessage: 'مثال: شقة من 3 غرف، تنظيف لمرة واحدة في مايو …', choose: 'اختاروا الخدمة', send: 'إرسال الطلب', success: 'شكراً لكم — وصل طلبكم بنجاح. سنتواصل معكم شخصياً في أقرب وقت.' },
    footer: { tagline: 'لمسة نظافة، علامة ثقة.', explore: 'اكتشف', reach: 'تواصل معنا', legal: 'البيانات القانونية · الخصوصية', rights: 'M.S Reinigung · لايبزيغ' },
  },
  en: {
    nav: { services: 'Services', why: 'Why M.S?', process: 'How it works', contact: 'Contact', cta: 'Request a visit' },
    hero: { kicker: 'Cleaning with care · Leipzig', title: 'Clean spaces that', accent: 'build trust.', body: 'We care for the places where people live, work and arrive home. Reliable, thorough and always attentive to the details.', primary: 'Get a free quote', secondary: 'Call us directly', note: 'Usually answered the same working day', badge: 'Care you can feel' },
    trust: ['Personal & punctual', 'Clear, fair pricing', 'Leipzig & nearby'],
    services: { label: 'Our services', title: 'More than clean. Just right for your space.', intro: 'Home, office or post-move: we bring order and freshness back with a familiar contact and results that last.', cards: [
      { title: 'Home cleaning', body: 'For a home that feels light and cared for — regular or one-off.' },
      { title: 'Office & commercial', body: 'Workplaces, practices and commercial spaces that feel professional.' },
      { title: 'Window cleaning', body: 'Clear views, streak-free and carefully finished right into the corners.' },
      { title: 'Move-out cleaning', body: 'Hand over spotless or move in calmly — we make the transition easier.' },
      { title: 'Deep cleaning', body: 'When a room deserves a genuine fresh start.' },
      { title: 'Regular care', body: 'Your rhythm, our dependable plan. Weekly, fortnightly or as needed.' },
    ] },
    story: { label: 'Why M.S Reinigung', title: 'A good feeling starts with a good team.', body: 'We are a local cleaning team from Leipzig. To us, cleaning is more than removing visible dirt. It means taking responsibility for your time, your space and your trust.', principles: [
      { title: 'An eye for detail', body: 'We notice what others may overlook.' },
      { title: 'Dependable routines', body: 'We keep the agreements we make.' },
      { title: 'Human & respectful', body: 'Your space, your rules, our respect.' },
      { title: 'Quality products', body: 'We choose effective products thoughtfully.' },
    ] },
    process: { label: 'How to book', title: 'Three steps to a space that breathes.', body: 'Start simply, plan clearly, arrive reliably.', steps: [
      { title: 'Get in touch', body: 'Call or send a short request. We listen first.' },
      { title: 'A time & a quote', body: 'We discuss your needs and find a time that works.' },
      { title: 'Feel the difference', body: 'Our team works with care — you enjoy the result.' },
    ] },
    testimonial: { label: 'A client note', title: 'Order that lasts.', quote: '“Finally a cleaning service that truly thinks along. Communication was warm, the appointment punctual, and the flat afterwards simply wonderful.”', person: 'Maria K.', detail: 'Private home · Leipzig South' },
    contact: { label: 'Your next step', title: 'Let’s get started.', body: 'Tell us briefly what you need. We will reply personally with the next steps — no detours and no obligation.', formTitle: 'Send an enquiry', name: 'Name', email: 'Email', phone: 'Phone', service: 'Service needed', message: 'Your message', placeholderName: 'What may we call you?', placeholderEmail: 'you@email.com', placeholderPhone: '+49 ...', placeholderMessage: 'For example: 3-room flat, one-off clean in May …', choose: 'Please choose', send: 'Send enquiry', success: 'Thank you — your enquiry has arrived. We will be in touch personally as soon as possible.' },
    footer: { tagline: 'A touch of cleanliness, a sign of trust.', explore: 'Explore', reach: 'Reach us', legal: 'Legal notice · Privacy', rights: 'M.S Reinigung · Leipzig' },
  },
};

const serviceIcons = [Sparkles, ShieldCheck, Star, CalendarDays, CheckCircle2, HeartHandshake];

function Home() {
  const [language, setLanguage] = useState<Language>('de');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const t = copy[language];

  useEffect(() => {
    const saved = window.localStorage.getItem('ms-language') as Language | null;
    if (saved && ['de', 'ar', 'en'].includes(saved)) setLanguage(saved);
  }, []);
  useEffect(() => {
    const isArabic = language === 'ar';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    window.localStorage.setItem('ms-language', language);
  }, [language]);

  const changeLanguage = (next: Language) => { setLanguage(next); setMenuOpen(false); };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); event.currentTarget.reset(); };

  return (
    <main className="site-shell">
      <div className="topbar"><div className="container-wide topbar-inner"><span className="topbar-note">{language === 'ar' ? 'فريق تنظيف محلي من لايبزيغ' : language === 'en' ? 'A local cleaning team from Leipzig' : 'Ein lokales Reinigungsteam aus Leipzig'}</span><span><Phone size={12} /> <a href="tel:+491791198226" data-testid="link-top-phone">+49 179 1198226</a></span></div></div>
      <nav className="nav" aria-label="Main navigation"><div className="container-wide nav-inner">
        <a className="brand" href="#top" data-testid="link-brand"><img className="brand-mark" src={logoPath} alt="M.S Reinigung logo" /><span className="brand-name">M.S REINIGUNG<small>sauber · zuverlässig · Leipzig</small></span></a>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}><a href="#leistungen" onClick={() => setMenuOpen(false)} data-testid="link-services">{t.nav.services}</a><a href="#warum" onClick={() => setMenuOpen(false)} data-testid="link-why">{t.nav.why}</a><a href="#ablauf" onClick={() => setMenuOpen(false)} data-testid="link-process">{t.nav.process}</a><a href="#kontakt" onClick={() => setMenuOpen(false)} data-testid="link-contact">{t.nav.contact}</a></div>
        <div className="nav-actions"><div className="language-switcher" aria-label="Language switcher">{(['de', 'ar', 'en'] as Language[]).map((lang) => <button key={lang} className={language === lang ? 'active' : ''} onClick={() => changeLanguage(lang)} aria-label={`Switch to ${lang}`} data-testid={`button-language-${lang}`}>{lang.toUpperCase()}</button>)}</div><a className="btn btn-primary" href="#kontakt" data-testid="link-nav-cta">{t.nav.cta}<ArrowRight size={15} /></a><button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-menu">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div>
      </div></nav>

      <section className="hero" id="top"><div className="container-wide hero-grid">
        <div className="hero-content reveal"><div className="hero-kicker eyebrow"><Sparkles size={15} /><span>{t.hero.kicker}</span></div><h1 className="display">{t.hero.title}<br /><em>{t.hero.accent}</em></h1><p className="hero-copy">{t.hero.body}</p><div className="hero-buttons"><a className="btn btn-primary" href="#kontakt" data-testid="link-hero-quote">{t.hero.primary}<ArrowRight size={16} /></a><a className="btn btn-outline" href="tel:+491791198226" data-testid="link-hero-call"><Phone size={16} />{t.hero.secondary}</a></div><div className="hero-quick"><Check size={14} color="var(--coral)" /><strong>{t.hero.note}</strong><span className="dot" /><span>Leipzig</span></div></div>
        <div className="hero-visual reveal delay-2"><div className="hero-photo" aria-label="Warm, cared-for space" /><div className="hero-logo-card"><img src={logoPath} alt="M.S Reinigung" /></div><div className="hero-sticker"><div><Sparkles size={19} /><span>{t.hero.badge}</span></div></div></div>
      </div></section>

      <section className="trust-strip" aria-label="Our promise"><div className="container-wide trust-row">{t.trust.map((item, index) => <div className="trust-item" key={item} data-testid={`text-trust-${index}`}><CheckCircle2 size={18} /><span><strong>{index === 0 ? (language === 'de' ? 'Unser Versprechen' : language === 'ar' ? 'وعدنا' : 'Our promise') : index === 1 ? (language === 'de' ? 'Transparent' : language === 'ar' ? 'شفافية' : 'Transparent') : (language === 'de' ? 'Vor Ort' : language === 'ar' ? 'محلياً' : 'Local') }</strong>{item}</span></div>)}</div></section>

      <section className="section services-section" id="leistungen"><div className="container-wide"><div className="section-header"><div><span className="section-label">{t.services.label}</span><h2>{t.services.title}</h2></div><p>{t.services.intro}</p></div><div className="services-grid">{t.services.cards.map((service, index) => { const Icon = serviceIcons[index]; return <article className="service-card reveal" key={service.title} style={{ animationDelay: `${index * 80}ms` }} data-testid={`card-service-${index}`}><div><div className="service-number">0{index + 1}</div><div className="service-icon"><Icon size={22} strokeWidth={1.7} /></div><h3>{service.title}</h3><p>{service.body}</p></div><ArrowRight className="service-arrow" size={19} /></article>; })}</div></div></section>

      <section className="section story-section" id="warum"><div className="container-wide story-grid"><div className="story-art reveal"><div className="story-blob" /><div className="story-frame" /><div className="story-badge"><HeartHandshake size={21} /><span>{language === 'de' ? 'Mit Herz bei der Sache' : language === 'ar' ? 'نضع القلب في عملنا' : 'With heart in our work'}</span></div></div><div className="story-copy reveal delay-1"><span className="section-label">{t.story.label}</span><h2>{t.story.title}</h2><p>{t.story.body}</p><div className="principles">{t.story.principles.map((principle, index) => <div className="principle" key={principle.title}><CheckCircle2 size={18} /><span><strong>{principle.title}</strong><span>{principle.body}</span></span></div>)}</div></div></div></section>

      <section className="section process-section" id="ablauf"><div className="container-wide"><div className="section-header"><div><span className="section-label">{t.process.label}</span><h2>{t.process.title}</h2></div><p>{t.process.body}</p></div><div className="process-row">{t.process.steps.map((step, index) => <article className={`process-step ${index === 1 ? 'active' : ''} reveal`} style={{ animationDelay: `${index * 120}ms` }} key={step.title} data-testid={`card-step-${index}`}><div className="step-no">0{index + 1}</div><h3>{step.title}</h3><p>{step.body}</p></article>)}</div></div></section>

      <section className="section testimonial-section"><div className="container-wide quote-layout"><div className="reveal"><span className="section-label">{t.testimonial.label}</span><div className="quote-mark">“</div><h2>{t.testimonial.title}</h2></div><div className="quote-card reveal delay-2"><blockquote>{t.testimonial.quote}</blockquote><div className="quote-person"><div className="quote-avatar">MK</div><span><strong>{t.testimonial.person}</strong><span>{t.testimonial.detail}</span></span></div></div></div></section>

      <section className="section contact-section" id="kontakt"><div className="container-wide"><div className="contact-panel"><div className="contact-copy"><span className="section-label">{t.contact.label}</span><h2>{t.contact.title}</h2><p>{t.contact.body}</p><div className="contact-links"><a className="contact-link" href="tel:+491791198226" data-testid="link-contact-phone"><Phone size={17} />+49 179 1198226</a><a className="contact-link" href="mailto:m.s.betriebswirtschaftslehre@gmail.com" data-testid="link-contact-email"><Mail size={17} />m.s.betriebswirtschaftslehre@gmail.com</a><span className="contact-link"><Clock3 size={17} />{language === 'de' ? 'Mo–Sa · 08:00–18:00' : language === 'ar' ? 'الإثنين–السبت · 08:00–18:00' : 'Mon–Sat · 08:00–18:00'}</span></div></div><div className="contact-form">{sent ? <div className="success-message" data-testid="status-form-success"><CheckCircle2 size={20} /><br />{t.contact.success}<br /><button className="btn btn-gold" style={{ marginTop: 18 }} onClick={() => setSent(false)} data-testid="button-new-enquiry">{language === 'de' ? 'Neue Anfrage' : language === 'ar' ? 'طلب جديد' : 'New enquiry'}</button></div> : <form onSubmit={submit}><h3>{t.contact.formTitle}</h3><div className="form-grid"><div className="field"><label htmlFor="name">{t.contact.name}</label><input id="name" name="name" required placeholder={t.contact.placeholderName} data-testid="input-name" /></div><div className="field"><label htmlFor="email">{t.contact.email}</label><input id="email" name="email" type="email" required placeholder={t.contact.placeholderEmail} data-testid="input-email" /></div><div className="field"><label htmlFor="phone">{t.contact.phone}</label><input id="phone" name="phone" placeholder={t.contact.placeholderPhone} data-testid="input-phone" /></div><div className="field"><label htmlFor="service">{t.contact.service}</label><select id="service" name="service" defaultValue="" required data-testid="select-service"><option value="" disabled>{t.contact.choose}</option>{t.services.cards.map((item) => <option value={item.title} key={item.title}>{item.title}</option>)}</select></div><div className="field full"><label htmlFor="message">{t.contact.message}</label><textarea id="message" name="message" placeholder={t.contact.placeholderMessage} data-testid="textarea-message" /></div></div><button className="btn btn-gold form-submit" type="submit" data-testid="button-submit-enquiry">{t.contact.send}<ArrowRight size={16} /></button></form>}</div></div></div></section>

      <footer className="footer"><div className="container-wide"><div className="footer-grid"><div><a className="brand" href="#top" data-testid="link-footer-brand"><img className="brand-mark" src={logoPath} alt="M.S Reinigung logo" /><span className="brand-name">M.S REINIGUNG<small>sauber · zuverlässig · Leipzig</small></span></a><p className="footer-tagline">{t.footer.tagline}</p></div><div><h4>{t.footer.explore}</h4><ul><li><a href="#leistungen" data-testid="link-footer-services">{t.nav.services}</a></li><li><a href="#warum" data-testid="link-footer-why">{t.nav.why}</a></li><li><a href="#ablauf" data-testid="link-footer-process">{t.nav.process}</a></li></ul></div><div><h4>{t.footer.reach}</h4><ul><li><a href="tel:+491791198226" data-testid="link-footer-phone">+49 179 1198226</a></li><li><a href="mailto:m.s.betriebswirtschaftslehre@gmail.com" data-testid="link-footer-email">E-Mail schreiben</a></li><li>Leipzig, Deutschland</li></ul></div><div><h4>{language === 'de' ? 'Folgen' : language === 'ar' ? 'تابعونا' : 'Follow'}</h4><ul><li><a href="#kontakt" data-testid="link-footer-instagram"><Instagram size={15} /> Instagram</a></li><li><a href="#kontakt" data-testid="link-footer-facebook"><Facebook size={15} /> Facebook</a></li></ul></div></div><div className="footer-bottom"><span>{t.footer.rights} · {t.footer.tagline}</span><span>{t.footer.legal}</span></div></div></footer>
    </main>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;