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

export const REPOSITORY_TTL = 30 * 60 * 1000;
const cacheKey = 'resume:github:v1';

export async function fetchRepositories(url: string) {
  // A successful snapshot survives reloads and language switches for 30 minutes.
  // Storage can be unavailable in private browsing; SWR still deduplicates in memory.
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) ?? 'null');
    const age = Date.now() - Date.parse(cached?.fetchedAt);
    if (
      age >= 0 &&
      age < REPOSITORY_TTL &&
      Array.isArray(cached?.repos) &&
      cached.repos.every(isRepository)
    ) {
      return cached as { repos: Repository[]; fetchedAt: string };
    }
  } catch {
    /* Invalid or unavailable storage is not a repository response. */
  }

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
  const result = {
    repos: data.filter(isRepository),
    fetchedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {
    /* Read-only storage. */
  }
  return result;
}

function isRepository(repo: unknown): repo is Repository {
  if (!repo || typeof repo !== 'object') return false;
  const value = repo as Record<string, unknown>;
  return (
    typeof value.name === 'string' &&
    featured.has(value.name) &&
    typeof value.html_url === 'string' &&
    value.html_url.startsWith(`https://github.com/${profile.github}/`) &&
    typeof value.stargazers_count === 'number' &&
    typeof value.forks_count === 'number' &&
    typeof value.pushed_at === 'string' &&
    !Number.isNaN(Date.parse(value.pushed_at)) &&
    (value.language === null || typeof value.language === 'string')
  );
}
