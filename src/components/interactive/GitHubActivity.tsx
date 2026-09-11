import useSWR from 'swr';
import { lazy, Suspense, useEffect, useState } from 'react';
const PixelBlast = lazy(() => import('./PixelBlast.jsx'));
import { content, profile, type Locale } from '../../data/resume';
import {
  fetchRepositories,
  repositoryUrl,
  REPOSITORY_TTL,
} from '../../lib/github';

export default function GitHubActivity({ locale }: { locale: Locale }) {
  const t = content[locale].github;
  const [showBackdrop, setShowBackdrop] = useState(false);
  // Keep the résumé/data island responsive while the optional WebGL bundle loads.
  useEffect(() => setShowBackdrop(true), []);
  // SWR owns cache, deduplication and refresh. Do not poll in hidden tabs or retry rate limits.
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    repositoryUrl,
    fetchRepositories,
    {
      refreshInterval: 0,
      dedupingInterval: REPOSITORY_TTL,
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );
  return (
    <section className="github-section section" aria-labelledby="github-title">
      {showBackdrop && (
        <Suspense fallback={null}>
          <PixelBlast
            className="github-pixel-blast"
            color="#526337"
            pixelSize={4}
            patternScale={2.2}
            patternDensity={0.8}
            edgeFade={0.8}
            speed={0.18}
            enableRipples={false}
            autoPauseOffscreen
          />
        </Suspense>
      )}
      <div className="github-heading">
        <div>
          <span className="eyebrow">OPEN SOURCE / GITHUB</span>
          <h2 id="github-title">{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>
        <a
          className="text-link"
          href={`https://github.com/${profile.github}`}
          target="_blank"
          rel="noreferrer"
        >
          {t.visit} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="github-status" role="status">
        {isLoading ? (
          t.loading
        ) : error ? (
          t.error
        ) : (
          <>
            <span className="status-dot" />
            {t.live} ·{' '}
            <time dateTime={data!.fetchedAt}>
              {new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-CA', {
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(data!.fetchedAt))}
            </time>
          </>
        )}
      </div>
      {error && (
        <button
          className="text-link"
          disabled={isValidating}
          onClick={() => void mutate()}
        >
          {t.retry} ↻
        </button>
      )}
      {data &&
        (data.repos.length ? (
          <div className="repo-grid">
            {data.repos.map((repo) => (
              <a
                className="repo-item"
                href={repo.html_url}
                key={repo.name}
                target="_blank"
                rel="noreferrer"
              >
                <div>
                  <h3>{repo.name}</h3>
                  <span aria-hidden="true">↗</span>
                </div>
                <p>{repo.language ?? '—'}</p>
                <div className="repo-stats">
                  <span aria-label={`${t.stars}: ${repo.stargazers_count}`}>
                    ☆ {repo.stargazers_count}
                  </span>
                  <span aria-label={`${t.forks}: ${repo.forks_count}`}>
                    ⑂ {repo.forks_count}
                  </span>
                </div>
                <p className="repo-date">
                  {t.updated}{' '}
                  <time dateTime={repo.pushed_at}>
                    {new Intl.DateTimeFormat(
                      locale === 'zh' ? 'zh-CN' : 'en-CA',
                      { year: 'numeric', month: 'short', day: 'numeric' },
                    ).format(new Date(repo.pushed_at))}
                  </time>
                </p>
              </a>
            ))}
          </div>
        ) : (
          <p>{t.empty}</p>
        ))}
    </section>
  );
}
