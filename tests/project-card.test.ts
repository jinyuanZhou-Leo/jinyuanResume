import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getBrandIcon } from '../src/lib/brand-icons.ts';
import { projects } from '../src/data/resume.ts';
import { renderBrandIcon, renderProjectCard } from './render.ts';
import type { Project } from '../src/data/types.ts';

test('project visuals follow the project when cards are reordered', () => {
  const semestra = renderProjectCard(projects[2], 'en', 0);
  const jsh = renderProjectCard(projects[0], 'en', 1);

  assert.match(semestra, /Semestra/);
  assert.doesNotMatch(semestra, /terminal-window/);
  assert.match(jsh, /class="project-visual terminal-visual"/);
  assert.match(jsh, /class="terminal-window"/);
  assert.match(jsh, /02 \/ SYSTEMS/);
});

test('repo-less Reversi cards do not create null or empty links', () => {
  const html = renderProjectCard(projects[1], 'en', 2);

  assert.match(html, /Reversi AI/);
  assert.doesNotMatch(html, /href=/);
  assert.doesNotMatch(html, /\/null/);
});

test('generic repo-less projects remain semantic text content', () => {
  const generic: Project = {
    ...projects[2],
    id: 'course-notes',
    name: 'Course Notes',
    repository: undefined,
  };
  const html = renderProjectCard(generic, 'zh', 4);

  assert.match(html, /<h3>Course Notes<\/h3>/);
  assert.match(html, /全栈应用/);
  assert.doesNotMatch(html, /<a\b/);
});

test('external repository links use the repository owner and name', () => {
  const external: Project = {
    ...projects[2],
    id: 'external-project',
    name: 'External Project',
    repository: { owner: 'other-owner', name: 'other-repo' },
  };
  const html = renderProjectCard(external, 'en', 0);

  assert.match(html, /href="https:\/\/github\.com\/other-owner\/other-repo"/);
  assert.doesNotMatch(html, /jinyuanZhou-Leo/);
});

test('project copy renders in both supported locales', () => {
  const zh = renderProjectCard(projects[0], 'zh', 0);
  const en = renderProjectCard(projects[0], 'en', 0);

  assert.match(zh, /系统开发/);
  assert.match(zh, /从第一行代码开始。/);
  assert.match(en, /SYSTEMS/);
  assert.match(en, /Start with the first line\./);
});

test('React brand icons render the same path and viewBox resolved for Astro', () => {
  for (const [name, size] of [
    ['GitHub', 23],
    ['Rust', 13],
  ] as const) {
    const icon = getBrandIcon(name);
    assert.ok(icon);

    const html = renderBrandIcon(name, size);
    assert.match(html, new RegExp(`data-brand="${name}"`));
    assert.match(html, new RegExp(`width="${size}" height="${size}"`));
    assert.ok(html.includes(`viewBox="${icon.viewBox}"`));
    assert.ok(html.includes(`d="${icon.paths[0]}"`));
  }

  assert.equal(renderBrandIcon('Unknown'), '');
});
