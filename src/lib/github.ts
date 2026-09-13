import { projects } from '../data/resume.ts';
import type { RepositoryRef } from '../data/types.ts';
import { repositoryHref } from './content.ts';

export type Repository = {
  owner: string;
  name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
};

export type RepositorySnapshot = {
  repos: Repository[];
  fetchedAt: string;
};

export const REPOSITORY_TTL = 30 * 60 * 1000;
const repositoryKeyPrefix = 'resume:github:v2:';

export function getSelectedRepositoryRefs(
  items: ReadonlyArray<{
    openSource: boolean;
    repository?: RepositoryRef | null;
  }>,
): RepositoryRef[] {
  const refs = items
    .filter((project) => project.openSource && project.repository)
    .map((project) => project.repository!);
  return normalizeRepositoryRefs(refs);
}

export const selectedRepositoryRefs = getSelectedRepositoryRefs(projects);

/**
 * The complete selection is part of both SWR's key and localStorage's key.
 * Changing the project declarations therefore cannot reuse an old snapshot.
 */
export function createRepositorySelectionKey(
  refs: ReadonlyArray<RepositoryRef>,
): string {
  return `${repositoryKeyPrefix}${JSON.stringify(normalizeRepositoryRefs(refs))}`;
}

export function repositoryUrl(ref: RepositoryRef): string {
  return `https://api.github.com/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.name)}`;
}

function refsFromSelectionKey(key: string): RepositoryRef[] {
  if (!key.startsWith(repositoryKeyPrefix)) {
    throw new Error('Invalid repository selection key');
  }

  const refs: unknown = JSON.parse(key.slice(repositoryKeyPrefix.length));
  if (!Array.isArray(refs)) throw new Error('Invalid repository selection');
  if (!refs.every(isRepositoryRef))
    throw new Error('Invalid repository selection');
  return normalizeRepositoryRefs(refs);
}

function isRepositoryRef(value: unknown): value is RepositoryRef {
  if (!value || typeof value !== 'object') return false;
  const ref = value as Record<string, unknown>;
  return typeof ref.owner === 'string' && typeof ref.name === 'string';
}

function repositoryIdentity(ref: RepositoryRef): string {
  return `${ref.owner.toLowerCase()}/${ref.name.toLowerCase()}`;
}

function normalizeRepositoryRefs(
  refs: ReadonlyArray<RepositoryRef>,
): RepositoryRef[] {
  const seen = new Set<string>();
  return refs.filter((ref) => {
    const identity = repositoryIdentity(ref);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

function sameRepositoryValue(value: unknown, expected: string): boolean {
  return (
    typeof value === 'string' && value.toLowerCase() === expected.toLowerCase()
  );
}

export function isRepository(
  value: unknown,
  expectedRef: RepositoryRef,
): value is Omit<Repository, 'owner'> {
  if (!value || typeof value !== 'object') return false;
  const repository = value as Record<string, unknown>;
  return (
    sameRepositoryValue(repository.name, expectedRef.name) &&
    sameRepositoryValue(repository.html_url, repositoryHref(expectedRef)) &&
    (repository.language === null || typeof repository.language === 'string') &&
    isNonNegativeNumber(repository.stargazers_count) &&
    isNonNegativeNumber(repository.forks_count) &&
    typeof repository.pushed_at === 'string' &&
    !Number.isNaN(Date.parse(repository.pushed_at))
  );
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function getStorage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    // Accessing storage itself can throw in private browsing contexts.
    return undefined;
  }
}

function readCachedRepositories(
  key: string,
  refs: ReadonlyArray<RepositoryRef>,
  now: number,
): RepositorySnapshot | undefined {
  try {
    const cached = JSON.parse(getStorage()?.getItem(key) ?? 'null') as {
      repos?: unknown;
      fetchedAt?: unknown;
    } | null;
    const cachedRepos = cached?.repos;
    const age = now - Date.parse(String(cached?.fetchedAt ?? ''));
    if (
      age >= 0 &&
      age < REPOSITORY_TTL &&
      typeof cached?.fetchedAt === 'string' &&
      Array.isArray(cachedRepos) &&
      cachedRepos.length === refs.length &&
      refs.every((ref) => cachedRepos.some((repo) => isRepository(repo, ref)))
    ) {
      return {
        repos: refs.map((ref) => {
          const repo = cachedRepos.find((candidate) =>
            isRepository(candidate, ref),
          );
          // The complete-selection guard above makes this lookup total.
          return { ...(repo as Omit<Repository, 'owner'>), owner: ref.owner };
        }),
        fetchedAt: cached.fetchedAt as string,
      };
    }
  } catch {
    // Invalid or unavailable storage is not a repository response.
  }
  return undefined;
}

function writeCachedRepositories(key: string, snapshot: RepositorySnapshot) {
  try {
    getStorage()?.setItem(key, JSON.stringify(snapshot));
  } catch {
    // Storage may be read-only or unavailable.
  }
}

async function fetchRepository(
  ref: RepositoryRef,
  fetchImpl: typeof fetch,
): Promise<Repository> {
  const response = await fetchImpl(repositoryUrl(ref), {
    signal: AbortSignal.timeout(10000),
    headers: {
      Accept: 'application/vnd.github+json',
      // GitHub's REST API version is pinned so response semantics stay stable.
      'X-GitHub-Api-Version': '2026-03-10',
    },
  });
  if (!response.ok) throw new Error(`GitHub ${response.status}`);

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Invalid repository response for ${ref.owner}/${ref.name}`);
  }
  if (!isRepository(data, ref)) {
    throw new Error(`Invalid repository response for ${ref.owner}/${ref.name}`);
  }
  return { ...(data as Omit<Repository, 'owner'>), owner: ref.owner };
}

export async function fetchRepositories(
  selectionKey: string,
): Promise<RepositorySnapshot> {
  const refs = refsFromSelectionKey(selectionKey);
  const cached = readCachedRepositories(selectionKey, refs, Date.now());
  if (cached) return cached;

  const repos = await Promise.all(
    refs.map((ref) => fetchRepository(ref, fetch)),
  );
  const snapshot = { repos, fetchedAt: new Date().toISOString() };
  writeCachedRepositories(selectionKey, snapshot);
  return snapshot;
}
