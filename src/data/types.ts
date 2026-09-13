export type Locale = 'zh' | 'en';
export type Localized = Record<Locale, string>;
export interface RepositoryRef {
  owner: string;
  name: string;
}
export type ProjectVisual =
  | { kind: 'terminal'; command: string; caption: Localized }
  | {
      kind: 'reversi';
      board: readonly number[];
      rank: number;
      total: number;
      caption: Localized;
    };
export interface Project {
  id: string;
  name: string;
  repository?: RepositoryRef;
  openSource: boolean;
  category: Localized;
  date: Localized;
  tags: readonly string[];
  title: Localized;
  description: Localized;
  visual?: ProjectVisual;
  tone?: string;
}
export interface Experience {
  id: string;
  company: Localized;
  role: Localized;
  start: string;
  end: string;
  location: Localized;
  points: readonly Localized[];
  tags: readonly string[];
}
export interface Education {
  id: string;
  name: Localized;
  degree: Localized;
  start?: string;
  end: string;
  expected?: boolean;
  gpa?: string;
  note?: Localized;
}
export interface Ability {
  id: string;
  label: Localized;
}
export interface SiteCopy {
  title: string;
  description: string;
  nav: Record<'work' | 'experience' | 'about' | 'contact', string>;
  skip: string;
  download: string;
  hero: Record<
    | 'intro'
    | 'line'
    | 'emphasis'
    | 'description'
    | 'cta'
    | 'location'
    | 'caption'
    | 'scroll',
    string
  >;
  projects: Record<
    | 'label'
    | 'title'
    | 'intro'
    | 'view'
    | 'previous'
    | 'next'
    | 'technologies'
    | 'overview',
    string
  >;
  experience: Record<'label' | 'title', string>;
  about: Record<
    | 'label'
    | 'title'
    | 'text'
    | 'skills'
    | 'people'
    | 'languageText'
    | 'learning',
    string
  >;
  github: Record<
    | 'title'
    | 'subtitle'
    | 'loading'
    | 'error'
    | 'retry'
    | 'live'
    | 'updated'
    | 'stars'
    | 'forks'
    | 'visit'
    | 'empty',
    string
  >;
  contact: Record<
    | 'label'
    | 'title'
    | 'text'
    | 'email'
    | 'copy'
    | 'copied'
    | 'copyError'
    | 'social'
    | 'personal'
    | 'university'
    | 'phone'
    | 'back'
    | 'footer',
    string
  >;
}
