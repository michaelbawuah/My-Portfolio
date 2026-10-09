# Updating portfolio content

Start with the [local setup instructions](../README.md#run-locally). Make each update on a branch and open a pull request against `main` so the content changes can be checked together.

## Where to edit

| Content | Source |
| --- | --- |
| Name, email, GitHub, LinkedIn, and primary project records | [`lib/portfolio.ts`](../lib/portfolio.ts) |
| Detailed case-study text, features, stages, and resource links | [`lib/case-content.json`](../lib/case-content.json) |
| Work gallery order, card-logo overrides, and SlopeChat overview | [`lib/project-showcase.ts`](../lib/project-showcase.ts) |
| Competitive programming overview and repository references | [`lib/competitive-programming.ts`](../lib/competitive-programming.ts) |
| Featured competitive programming solutions and visual references | [`lib/competitive-solutions.json`](../lib/competitive-solutions.json) |
| About introduction, My Story, and engineering principles | [`app/about/page.tsx`](../app/about/page.tsx) |
| Personal photo paths, dimensions, captions, and groups | [`lib/personal-photos.json`](../lib/personal-photos.json) |
| TikTok and Instagram links | [`lib/personal.ts`](../lib/personal.ts) |
| Shared page metadata helpers | [`lib/seo.ts`](../lib/seo.ts) |

Page-specific titles and descriptions are also defined in the corresponding `app/**/page.tsx` file.

## Project updates

For an existing primary project, update its record in `lib/portfolio.ts` and the matching entry in `lib/case-content.json`. Keep its slug consistent: the gallery and the [shared project route](../app/projects/[slug]/page.tsx) use that identifier to connect the records.

The Work gallery is assembled in `lib/project-showcase.ts`. Its primary-project order is explicit, while SlopeChat and Pro Competitive Programming are appended separately. New projects need both their content and their gallery entry. SlopeChat and Pro Competitive Programming have [dedicated](../app/projects/slopechat/page.tsx) [page implementations](../app/projects/pro-competitive-programming/page.tsx), so check those pages when updating their content.

Keep measurements tied to their recorded environment and date. Update the evidence links alongside any changed result, and distinguish sample-data images from live product screenshots.

## Pictures and links

Store images in [`public/`](../public/). A file at `public/logos/navox.png` is served as `/logos/navox.png`; the public URL does not include `public`.

Set descriptive alternative text where an image conveys information. For personal photographs, keep width, height, caption, and group values aligned with the image. Preserve the asset credits in [`INTERACTION-SOURCE.md`](INTERACTION-SOURCE.md) and the relevant asset manifests.

After replacing a picture, open both the Work gallery and its full case study. They can use different image fields. Follow any changed source, demo, or document link to confirm that its destination matches its label.

## Check the change

For TypeScript, JSON content, or interface changes, run:

```bash
pnpm exec tsc --noEmit --incremental false
pnpm build
pnpm start
```

Inspect the affected pages in the local preview. Check a phone-sized viewport and desktop, both themes, and keyboard navigation. For sectioned pages, test both chapter links and continuous scrolling. For motion changes, check the reduced-motion setting and report whether the browser could render WebGL.

Include the affected URLs, checks performed, and screenshots where they help explain a visual change in the pull request. For documentation-only updates, verify the file paths and links you edited.

## Publishing

The public site is published through Sites. Merging this GitHub repository updates the source stored here; it does not by itself publish a new version of the live portfolio. Carry the approved changes into the Sites project, preview them, and publish through that project.
