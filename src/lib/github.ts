import { profile } from '../data/resume';
export type Repository = {
  name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
};
const featured = new Set(['jsh', 'Semestra', 'iSchedule', 'LLMCoTAnalyzer']);
export const repositoryUrl = `https://api.github.com/users/${profile.github}/repos?per_page=100&sort=pushed`;

export async function fetchRepositories(url: string) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2026-03-10',
    },
  });
  if (!response.ok) throw new Error(`GitHub ${response.status}`);
  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error('Invalid repository response');
  // Validate external data before formatting numbers, dates, or outbound links.
  const repos = data.filter(
    (repo): repo is Repository =>
      repo &&
      typeof repo.name === 'string' &&
      featured.has(repo.name) &&
      typeof repo.html_url === 'string' &&
      repo.html_url.startsWith(`https://github.com/${profile.github}/`) &&
      typeof repo.stargazers_count === 'number' &&
      typeof repo.forks_count === 'number' &&
      typeof repo.pushed_at === 'string' &&
      !Number.isNaN(Date.parse(repo.pushed_at)) &&
      (repo.language === null || typeof repo.language === 'string'),
  );
  return { repos, fetchedAt: new Date().toISOString() };
}
