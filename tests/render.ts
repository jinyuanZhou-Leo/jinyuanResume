import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';
import { renderToStaticMarkup } from 'react-dom/server';
import React, { type ComponentType } from 'react';

const require = createRequire(import.meta.url);
const modules = new Map<string, { exports: Record<string, unknown> }>();
// A local TSX loader keeps rendering tests dependency-free without changing Node's global loader.
function load(file: string): Record<string, unknown> {
  const path = [file, `${file}.ts`, `${file}.tsx`].find(existsSync);
  if (!path) throw new Error(`Missing test module: ${file}`);
  const cached = modules.get(path);
  if (cached) return cached.exports;
  const module = { exports: {} as Record<string, unknown> };
  modules.set(path, module);
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: path,
  });
  new Function('require', 'module', 'exports', outputText)(
    (name: string) =>
      name.startsWith('.') ? load(resolve(dirname(path), name)) : require(name),
    module,
    module.exports,
  );
  return module.exports;
}
function renderComponent(path: string, props: Record<string, unknown>) {
  const component = load(resolve(path)).default as ComponentType<
    Record<string, unknown>
  >;
  return renderToStaticMarkup(React.createElement(component, props));
}
export function renderProjectCard(
  project: object,
  locale: 'zh' | 'en',
  index: number,
) {
  return renderComponent('src/components/interactive/ProjectCard.tsx', {
    project,
    locale,
    index,
  });
}
export function renderBrandIcon(name: string, size = 20) {
  return renderComponent('src/components/interactive/BrandIcon.tsx', {
    name,
    size,
  });
}
