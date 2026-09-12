import { animate, scroll, stagger, interpolate } from 'motion';
import Lenis from 'lenis';
import { mountAboutJourney } from './about-journey';
import { mountChapters } from './chapters';
import { mountSnapTimeline } from './snap-timeline';
import 'lenis/dist/lenis.css';

export function mountMotion() {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return () => {};
  const measureHeader = () => {
    document.documentElement.style.setProperty(
      '--viewport-width',
      `${document.documentElement.clientWidth}px`,
    );
    document.documentElement.style.setProperty(
      '--nav-height',
      `${header.offsetHeight}px`,
    );
  };
  measureHeader();
  const headerResize = new ResizeObserver(measureHeader);
  headerResize.observe(header);
  const desktop = window.matchMedia('(min-width: 761px)');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const disposers: (() => void)[] = [];
  const stop = () => {
    disposers
      .splice(0)
      .reverse()
      .forEach((dispose) => dispose());
    document.documentElement.classList.remove('cinematic-scroll');
  };
  const start = () => {
    stop();
    if (preference.matches) return;
    document.documentElement.classList.add('cinematic-scroll');
    const smoothScroll = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    disposers.push(() => smoothScroll.destroy());
    disposers.push(mountSnapTimeline(smoothScroll));

    const intro = animate(
      '.hero-content > *',
      { opacity: [0.2, 1], y: [30, 0] },
      { duration: 1.05, delay: stagger(0.1), ease: [0.22, 1, 0.36, 1] },
    );
    disposers.push(() => intro.complete());

    const scenes = [...document.querySelectorAll<HTMLElement>('.scroll-scene')];
    // Pin long chapters at their bottom so every line can be read before handoff.
    // Observe untransformed layout dimensions, including asynchronously loaded repositories.
    const resize = new ResizeObserver(() => {
      scenes.forEach((scene) => {
        const stage = scene.querySelector<HTMLElement>('.scene-stage');
        if (stage) {
          scene.style.setProperty('--scene-height', `${stage.offsetHeight}px`);
        }
      });
      smoothScroll.resize();
    });
    scenes.forEach((scene, index) => {
      scene.style.setProperty('--scene-order', String(index));
      const stage = scene.querySelector<HTMLElement>('.scene-stage');
      if (stage) {
        scene.style.setProperty('--scene-height', `${stage.offsetHeight}px`);
        resize.observe(stage);
      }
    });
    disposers.push(() => resize.disconnect());

    // Each project reveals over its own scroll interval, regardless of section length.
    document
      .querySelectorAll<HTMLElement>(
        '.featured-project:not(.scroll-stack-card), .project-row:not(.scroll-stack-card)',
      )
      .forEach((project) => {
        const reveal = animate(
          project,
          { opacity: [0, 1], y: [160, 0], scale: [0.96, 1] },
          { ease: 'linear', autoplay: false },
        );
        disposers.push(() => reveal.cancel());
        disposers.push(
          scroll(
            (progress: number) => {
              reveal.time = progress * reveal.duration;
            },
            {
              target: project,
              offset: ['start 100%', 'start 42%'],
            },
          ),
        );
      });

    // Interpolate a single shared canvas, including text contrast, across chapter boundaries.
    const palette = [
      ['#f8f8f5', '#232520', '#62645c', '#d9dbd3'],
      ['#f8f8f5', '#232520', '#62645c', '#d9dbd3'],
      ['#eeeeea', '#232520', '#53584b', '#d3d6cc'],
      ['#f8f8f5', '#232520', '#62645c', '#d9dbd3'],
      ['#f8f8f5', '#232520', '#62645c', '#d9dbd3'],
      ['#252821', '#f8f8f5', '#c1c7b7', '#555a4e'],
    ];
    const tokens = [
      '--reading-paper',
      '--reading-ink',
      '--reading-muted',
      '--reading-line',
    ];
    let boundaries: number[] = [];
    let colors: string[][] = [];
    const measurePalette = () => {
      boundaries = [0];
      colors = [palette[0]];
      scenes.slice(1).forEach((scene, index) => {
        const top = scene.getBoundingClientRect().top + window.scrollY;
        // Start the closing palette while GitHub is still pinned, spreading the
        // large luminance change over more than two viewport heights.
        const transitionDistance =
          scene.id === 'contact' && desktop.matches ? 2.6 : 1;
        boundaries.push(
          top - window.innerHeight * transitionDistance,
          top - window.innerHeight * 0.12,
        );
        colors.push(palette[index], palette[index + 1]);
      });
    };
    measurePalette();
    let samplers = tokens.map((_, i) =>
      interpolate(
        boundaries,
        colors.map((color) => color[i]),
      ),
    );
    const refreshPalette = () => {
      measurePalette();
      samplers = tokens.map((_, i) =>
        interpolate(
          boundaries,
          colors.map((color) => color[i]),
        ),
      );
    };
    // Resize includes language-dependent text wrapping and live repository content.
    const canvasResize = new ResizeObserver(refreshPalette);
    scenes.forEach((scene) => canvasResize.observe(scene));
    disposers.push(() => canvasResize.disconnect());
    disposers.push(
      scroll((_progress: number, info: { y: { current: number } }) => {
        tokens.forEach((token, i) =>
          document.documentElement.style.setProperty(
            token,
            samplers[i](info.y.current),
          ),
        );
      }),
    );
    disposers.push(() =>
      tokens.forEach((token) =>
        document.documentElement.style.removeProperty(token),
      ),
    );

    document
      .querySelectorAll<HTMLElement>(
        desktop.matches
          ? '.contact-top, .contact-bottom'
          : '.experience-detail > p, .experience-detail > h3, .experience-detail > ul:not(.tags) > li, .experience-detail > .tags, .about-details > *, #github .scene-content, .contact-top, .contact-bottom',
      )
      .forEach((element) => {
        element.setAttribute('data-reading-reveal', '');
        const reveal = animate(
          element,
          { opacity: [0, 1], y: [80, 0] },
          { ease: 'linear', autoplay: false },
        );
        disposers.push(() => reveal.cancel());
        disposers.push(
          scroll(
            (progress: number) => {
              reveal.time = progress * reveal.duration;
            },
            { target: element, offset: ['start 96%', 'start 58%'] },
          ),
        );
      });

    if (desktop.matches) {
      disposers.push(mountChapters());
      disposers.push(mountAboutJourney());
    }
    const github = document.querySelector<HTMLElement>('#github');
    if (github) {
      disposers.push(
        scroll(
          (progress: number) => {
            github.style.setProperty('--chapter-progress', String(progress));
          },
          { target: github, offset: ['start start', 'end end'] },
        ),
      );
      disposers.push(() => github.style.removeProperty('--chapter-progress'));
    }

    const overview = document.querySelector<HTMLElement>('.project-overview');
    if (overview) {
      document
        .querySelectorAll<HTMLElement>('[data-grid-row]')
        .forEach((row, index) => {
          const direction = index % 2 === 0 ? 1 : -1;
          const motion = animate(
            row,
            {
              x: [
                direction * (desktop.matches ? 480 : 260),
                direction * (desktop.matches ? -480 : -260),
              ],
            },
            { ease: 'linear', autoplay: false },
          );
          disposers.push(() => motion.cancel());
          disposers.push(
            scroll(
              (progress: number) => {
                motion.time = progress * motion.duration;
              },
              {
                target: overview,
                offset: ['start 80%', 'end 25%'],
              },
            ),
          );
        });
    }

    // Release the outgoing text before the canvas crosses its mid-tone, then reveal contact.
    const release = animate(
      '#github .scene-stage',
      { opacity: [1, 0] },
      { ease: 'linear', autoplay: false },
    );
    disposers.push(() => release.cancel());
    disposers.push(
      scroll(
        (progress: number) => {
          release.time = progress * release.duration;
        },
        {
          target: scenes[scenes.length - 1],
          offset: desktop.matches
            ? ['start 240%', 'start 160%']
            : ['start 100%', 'start 70%'],
        },
      ),
    );

    const hero = scenes[0];
    const image = animate(
      '.hero-image',
      { scale: [1, 1.24] },
      { ease: 'linear', autoplay: false },
    );
    const text = animate(
      '.hero-content',
      { opacity: [1, 1, 0], y: [0, -20, -90] },
      { times: [0, 0.25, 1], ease: 'linear', autoplay: false },
    );
    for (const animation of [image, text]) {
      disposers.push(() => animation.cancel());
      disposers.push(
        scroll(
          (progress: number) => {
            animation.time = progress * animation.duration;
          },
          {
            target: hero,
            offset: ['start start', 'end end'],
          },
        ),
      );
    }
  };
  start();
  preference.addEventListener('change', start);
  desktop.addEventListener('change', start);
  return () => {
    stop();
    preference.removeEventListener('change', start);
    desktop.removeEventListener('change', start);
    headerResize.disconnect();
  };
}
