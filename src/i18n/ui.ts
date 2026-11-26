// Interface strings for the homepage. Every key in `it` must exist in `en`
// (TypeScript enforces it), so a missing translation shows up in the editor.

export const languages = { it: 'IT', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'it';

const it = {
  metaDescription: 'Monopoli Coders Club: community di sviluppatori, studenti e appassionati di tecnologia a Monopoli (BA). Workshop gratuiti, talk, progetti open source e un blog scritto dai membri.',
  ogDescription: 'Community di sviluppatori a Monopoli: workshop gratuiti, talk, progetti e un blog della community.',
  themeToggle: 'Cambia tema',
  close: 'Chiudi',
  openPoster: 'Apri poster',
  posterDialog: 'Poster workshop',

  navAbout: 'Chi siamo',
  navWorkshops: 'Workshops',
  navProjects: 'Progetti',
  navContacts: 'Contatti',
  navBlog: 'Blog',

  eventLabel: 'Prossimo evento',
  eventNone: 'Il prossimo incontro è in preparazione. Entra nella community WhatsApp per essere tra i primi a saperlo.',
  eventNoneCta: 'Avvisami su WhatsApp',
  eventSignup: 'Iscriviti',
  eventCalendar: 'Aggiungi al calendario',
  eventToday: 'oggi',
  eventTomorrow: 'domani',
  eventInDays: 'tra {n} giorni',

  blogLabel: 'Blog',
  blogText: 'Articoli, guide e appunti scritti dai membri della community. Hai imparato qualcosa di utile? Condividilo.',
  blogAll: 'Tutti gli articoli',
  blogWrite: 'Scrivi un articolo',
  blogEmpty: 'Ancora nessun articolo: il primo potrebbe essere il tuo.',

  aboutLabel: 'Chi siamo',
  aboutText: 'Monopoli Coders Club è una community di sviluppatori, studenti e appassionati di tecnologia con base a Monopoli. Ci incontriamo per condividere conoscenze, lavorare su progetti e crescere insieme attraverso workshop, talk e sessioni di coding pratico.',

  workshopsLabel: 'Workshops',
  workshopsText: 'Una raccolta dei workshop organizzati da Monopoli Coders Club: incontri gratuiti e aperti a tutti, pensati per condividere strumenti e tecniche, e crescere insieme come community.',

  projectsLabel: 'Progetti',
  projectName: 'MCC Website',
  projectsText: 'Il sito che stai guardando: bilingue e open source, con il blog, i workshop e i contatti della community.',
  projectsCta: 'Vedi su GitHub',

  contactsLabel: 'Contatti',
  contactsCta: 'Entra nella community WhatsApp',
  contactsInstagram: 'Seguici su Instagram',

  footerMade: 'Made with',
  footerPlace: 'in Monopoli',
};

const en: Record<keyof typeof it, string> = {
  metaDescription: 'Monopoli Coders Club: a community of developers, students and tech enthusiasts in Monopoli, Italy. Free workshops, talks, open-source projects and a blog written by members.',
  ogDescription: 'Developer community in Monopoli, Italy: free workshops, talks, projects and a community blog.',
  themeToggle: 'Toggle theme',
  close: 'Close',
  openPoster: 'Open poster',
  posterDialog: 'Workshop poster',

  navAbout: 'About us',
  navWorkshops: 'Workshops',
  navProjects: 'Projects',
  navContacts: 'Contacts',
  navBlog: 'Blog',

  eventLabel: 'Next event',
  eventNone: 'Our next meetup is in the works. Join the WhatsApp community to be the first to know.',
  eventNoneCta: 'Notify me on WhatsApp',
  eventSignup: 'Sign up',
  eventCalendar: 'Add to calendar',
  eventToday: 'today',
  eventTomorrow: 'tomorrow',
  eventInDays: 'in {n} days',

  blogLabel: 'Blog',
  blogText: 'Articles, guides and notes written by community members. Learned something useful? Share it.',
  blogAll: 'All articles',
  blogWrite: 'Write an article',
  blogEmpty: 'No articles yet: the first one could be yours.',

  aboutLabel: 'About us',
  aboutText: 'Monopoli Coders Club is a community of developers, students, and tech enthusiasts based in Monopoli. We meet to share knowledge, work on projects, and grow our skills together through workshops, talks, and hands-on coding sessions.',

  workshopsLabel: 'Workshops',
  workshopsText: 'A collection of workshops organized by Monopoli Coders Club: free events open to everyone, designed to share tools and techniques, and grow together as a community.',

  projectsLabel: 'Projects',
  projectName: 'MCC Website',
  projectsText: 'The site you are looking at: bilingual and open source, with the community\'s blog, workshops and contacts.',
  projectsCta: 'View on GitHub',

  contactsLabel: 'Contacts',
  contactsCta: 'Join our WhatsApp community',
  contactsInstagram: 'Follow us on Instagram',

  footerMade: 'Made with',
  footerPlace: 'in Monopoli',
};

export const ui = { it, en };
export type UiKey = keyof typeof it;

export function useTranslations(lang: Lang) {
  return (key: UiKey) => ui[lang][key];
}

// Picks the right language from a { it, en } value; plain strings pass through
export function localize(value: string | { it: string; en: string } | undefined, lang: Lang): string {
  if (value == null) return '';
  return typeof value === 'string' ? value : value[lang];
}

// Path of the homepage in a given language
export const homePath = (lang: Lang) => (lang === defaultLang ? '/' : `/${lang}/`);
