# Art direction and sources

Visual thesis: a quiet tea-lab still life, with brushed steel, clear type and space to think. The résumé remains the main content; the tea motif adds personality without claiming affiliation with HEYTEA.

Content sequence: introduction → selected engineering projects → internship → education and skills → public repository activity → social links and contact.

Interaction thesis: a staggered hero entrance, subtle scroll-linked image scale, and restrained hover/route transitions. Project articles reveal with scroll progress. The footer has a decorative metal paper crane photograph, without copy or interaction.

## References checked

- HEYTEA official website: https://www.heytea.com/cn
- HEYTEA official site stylesheet inspected on 2026-09-10: https://www.heytea.com/assets/index-DsAMT8QL.css
- Foundertype custom typeface case: https://www.foundertype.com/index.php/FontofMade/caseDetail/id/16
- Manrope: https://fonts.google.com/specimen/Manrope
- Astro components: https://docs.astro.build/en/basics/astro-components/
- Astro i18n: https://docs.astro.build/en/guides/internationalization/
- Astro framework components: https://docs.astro.build/en/guides/framework-components/
- Motion: https://motion.dev/docs/inview and https://motion.dev/docs/scroll
- SWR: https://swr.vercel.app/docs/api
- Lucide Astro: https://lucide.dev/guide/astro
- GitHub REST repositories: https://docs.github.com/en/rest/repos/repos

HEYTEA's stylesheet declares GenSekiGothic2, FZFWZhuZiHei and HeyteaMono families. This implementation uses locally hosted open-source Manrope and Noto Sans SC; it does not redistribute the site's custom font files.

## Generated image

Footer asset: `public/images/contact-crane.webp`. Generated using the built-in image tool, encoded with Sharp. Prompt:

A minimal premium studio still life for the footer of a HEYTEA-inspired personal portfolio. Square 1024x1024. A single small sculptural brushed stainless steel paper crane, carefully folded from thin silver metal, sits beside one smooth ivory Reversi game stone. Photorealistic, delicate folds, restrained silver highlights and very soft shadow on a seamless deep olive charcoal surface and background, exact approximate background color #252821. Objects centered with generous negative space on all sides, sculptural quiet optimism and a student learning to take flight. No text, no symbols, no logo, no illustration, no border, no frame, no additional props. High-end minimal studio photography. Match understated stainless steel and ivory tea campaign materials.

Brand logos are sourced from Simple Icons and Font Awesome Free Brands and rendered as static SVGs. Non-brand concepts retain text labels.

Tool: built-in image generation (not CLI).
Final asset: `public/images/hero.webp` (1536 × 1024), encoded as WebP with Sharp. Image is decorative; the photograph is not a portrait or a claim about the owner's possessions.

Prompt:

Create a refined photorealistic studio still-life photograph for a personal software engineer portfolio, inspired by the restraint of HEYTEA contemporary Chinese tea campaign art direction. Landscape 1536x1024. Seamless very light warm grey background and surface, generous negative space on the LEFT HALF for website typography. On the RIGHT HALF: one beautiful brushed stainless steel tumbler with a translucent lid and straight straw, a small subtle embossed code symbol >_ on its front (no brand names), beside two smooth black and ivory Reversi game stones, a slim ivory mechanical keyboard partially entering at the bottom right. A tiny fresh green tea leaf rests on the lid, only green accent. Directional natural studio sunlight from upper left casts long soft elegant shadows rightward, soft material realism, exquisite brushed metal texture. Objects occupy rightmost 55 percent of frame, composition spacious and grounded, monochrome silver ivory charcoal, a warm minimal tea lab mood. Camera three-quarter view, no people, no text except the tiny >_ symbol, no UI, no graphics, no gradients as graphics, no clutter. High-end real product photography, editorial art direction.
