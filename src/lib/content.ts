import type { Education, Locale, RepositoryRef } from '../data/types.ts';

export function repositoryHref(repository: RepositoryRef): string {
  return `https://github.com/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}`;
}

export function formatPeriod(
  start: string | undefined,
  end: string,
  locale: Locale,
): string {
  const format = (value: string) => {
    if (!value.includes('-')) return value;
    if (locale === 'zh') return value.replace('-', '.');
    return new Intl.DateTimeFormat('en-CA', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
      .format(new Date(`${value}-01T00:00:00Z`))
      .toUpperCase();
  };
  return start ? `${format(start)} — ${format(end)}` : format(end);
}

export function educationDate(school: Education, locale: Locale): string {
  const date = formatPeriod(school.start, school.end, locale);
  return school.expected
    ? locale === 'zh'
      ? `预计 ${date} 年毕业`
      : `Expected ${date}`
    : date;
}
