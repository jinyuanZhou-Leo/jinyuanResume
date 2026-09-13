import assert from 'node:assert/strict';
import { after, afterEach, describe, it } from 'node:test';
import { repositoryHref } from '../src/lib/content.ts';
import {
  createRepositorySelectionKey,
  fetchRepositories,
  getSelectedRepositoryRefs,
  isRepository,
  repositoryUrl,
  REPOSITORY_TTL,
  type Repository,
} from '../src/lib/github.ts';

const originalFetch = globalThis.fetch;
const originalStorageDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  'localStorage',
);
const storageValues = new Map<string, string>();

// Avoid touching Node's experimental localStorage getter during the tests.
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => storageValues.get(key) ?? null,
    setItem: (key: string, value: string) => storageValues.set(key, value),
  },
});

function repository(ref: { owner: string; name: string }): Repository {
  return {
    owner: ref.owner,
    name: ref.name,
    html_url: repositoryHref(ref),
    language: 'TypeScript',
    stargazers_count: 3,
    forks_count: 1,
    pushed_at: '2026-09-10T12:00:00Z',
  };
}

function response(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  storageValues.clear();
});

after(() => {
  if (originalStorageDescriptor) {
    Object.defineProperty(
      globalThis,
      'localStorage',
      originalStorageDescriptor,
    );
  } else {
    Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

describe('GitHub repository selection', () => {
  it('keeps external owners and requests each declared repository directly', async () => {
    const refs = getSelectedRepositoryRefs([
      {
        openSource: true,
        repository: { owner: 'jinyuanZhou-Leo', name: 'jsh' },
      },
      {
        openSource: true,
        repository: { owner: 'octocat', name: 'hello-world' },
      },
      { openSource: false, repository: { owner: 'ignored', name: 'private' } },
      { openSource: true },
      { openSource: true, repository: null },
    ]);
    const requested: string[] = [];
    globalThis.fetch = async (input) => {
      const url = String(input);
      requested.push(url);
      const ref = refs.find((candidate) => url === repositoryUrl(candidate));
      assert.ok(ref);
      return response(repository(ref));
    };

    const result = await fetchRepositories(createRepositorySelectionKey(refs));

    assert.deepEqual(requested, refs.map(repositoryUrl));
    assert.equal(
      requested.some((url) => url.includes('/users/')),
      false,
    );
    assert.deepEqual(
      result.repos.map(({ owner, name }) => ({ owner, name })),
      refs,
    );
  });

  it('ignores malformed payloads and rejects links for another repository', async () => {
    const ref = { owner: 'octocat', name: 'hello-world' };
    const valid = repository(ref);
    assert.equal(isRepository(valid, ref), true);
    assert.equal(
      isRepository(
        { ...valid, html_url: 'https://github.com/other/hello-world' },
        ref,
      ),
      false,
    );
    assert.equal(
      isRepository(
        { ...valid, stargazers_count: '3', pushed_at: 'not-a-date' },
        ref,
      ),
      false,
    );

    globalThis.fetch = async () => response({ message: 'unexpected shape' });
    await assert.rejects(
      fetchRepositories(createRepositorySelectionKey([ref])),
      /Invalid repository response/,
    );
  });

  it('deduplicates selected repositories case-insensitively', () => {
    const refs = getSelectedRepositoryRefs([
      {
        openSource: true,
        repository: { owner: 'octocat', name: 'hello-world' },
      },
      {
        openSource: true,
        repository: { owner: 'OCTOCAT', name: 'HELLO-WORLD' },
      },
      {
        openSource: true,
        repository: { owner: 'other-owner', name: 'other-repo' },
      },
    ]);

    assert.deepEqual(refs, [
      { owner: 'octocat', name: 'hello-world' },
      { owner: 'other-owner', name: 'other-repo' },
    ]);
  });

  it('includes the complete selection in the SWR and persistent cache key', async () => {
    const first = [{ owner: 'octocat', name: 'hello-world' }];
    const second = [...first, { owner: 'octocat', name: 'another-repo' }];
    const firstKey = createRepositorySelectionKey(first);
    const secondKey = createRepositorySelectionKey(second);
    assert.notEqual(firstKey, secondKey);

    const storage = storageValues;
    let calls = 0;
    globalThis.fetch = async (input) => {
      calls += 1;
      const url = String(input);
      const ref = second.find((candidate) => url === repositoryUrl(candidate));
      assert.ok(ref);
      return response(repository(ref));
    };

    await fetchRepositories(firstKey);
    await fetchRepositories(firstKey);
    await fetchRepositories(secondKey);

    assert.equal(calls, 3);
    assert.equal(storage.has(firstKey), true);
    assert.equal(storage.has(secondKey), true);
    const stored = JSON.parse(storage.get(firstKey)!);
    assert.ok(Date.now() - Date.parse(stored.fetchedAt) < REPOSITORY_TTL);
  });

  it('refetches when the cached selection is incomplete', async () => {
    const refs = [
      { owner: 'octocat', name: 'hello-world' },
      { owner: 'octocat', name: 'another-repo' },
    ];
    const key = createRepositorySelectionKey(refs);
    storageValues.set(
      key,
      JSON.stringify({
        repos: [repository(refs[0])],
        fetchedAt: new Date().toISOString(),
      }),
    );
    const requested: string[] = [];
    globalThis.fetch = async (input) => {
      requested.push(String(input));
      const ref = refs.find(
        (candidate) => String(input) === repositoryUrl(candidate),
      );
      assert.ok(ref);
      return response(repository(ref));
    };

    const result = await fetchRepositories(key);

    assert.equal(requested.length, refs.length);
    assert.equal(result.repos.length, refs.length);
  });

  it('refetches when the cached selection contains a duplicate repository', async () => {
    const refs = [
      { owner: 'octocat', name: 'hello-world' },
      { owner: 'octocat', name: 'another-repo' },
    ];
    const key = createRepositorySelectionKey(refs);
    storageValues.set(
      key,
      JSON.stringify({
        repos: [repository(refs[0]), repository(refs[0])],
        fetchedAt: new Date().toISOString(),
      }),
    );
    let calls = 0;
    globalThis.fetch = async (input) => {
      calls += 1;
      const ref = refs.find(
        (candidate) => String(input) === repositoryUrl(candidate),
      );
      assert.ok(ref);
      return response(repository(ref));
    };

    const result = await fetchRepositories(key);

    assert.equal(calls, refs.length);
    assert.deepEqual(
      result.repos.map(({ owner, name }) => ({ owner, name })),
      refs,
    );
  });

  it('does not cache an HTTP error response', async () => {
    const ref = { owner: 'octocat', name: 'hello-world' };
    globalThis.fetch = async () =>
      response({ message: 'rate limited' }, false, 429);

    await assert.rejects(
      fetchRepositories(createRepositorySelectionKey([ref])),
      /GitHub 429/,
    );
    assert.equal(storageValues.size, 0);
  });

  it('refetches an expired cached snapshot', async () => {
    const ref = { owner: 'octocat', name: 'hello-world' };
    const key = createRepositorySelectionKey([ref]);
    storageValues.set(
      key,
      JSON.stringify({
        repos: [repository(ref)],
        fetchedAt: new Date(Date.now() - REPOSITORY_TTL - 1).toISOString(),
      }),
    );
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      return response(repository(ref));
    };

    const result = await fetchRepositories(key);

    assert.equal(calls, 1);
    assert.equal(result.repos.length, 1);
  });

  it('surfaces request failures for SWR to render and retry explicitly', async () => {
    const ref = { owner: 'octocat', name: 'hello-world' };
    globalThis.fetch = async () => {
      throw new Error('network unavailable');
    };

    await assert.rejects(
      fetchRepositories(createRepositorySelectionKey([ref])),
      /network unavailable/,
    );
  });
});
