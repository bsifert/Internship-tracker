# Portfolio site

A one-page static site for showing my projects to employers. It is plain HTML and
CSS with no build step: open `index.html` in a browser to preview it.

## What's on it

Written for recruiters. A dark "drafting table" hero states what I'm looking
for (Summer 2027 mechanical engineering internship) with the bell crank drawn
beside it and four headline numbers. Then four project "sheets", experience,
skills, and a closing contact band.

1. **Minimum-Mass Titanium Bell Crank** (Terps Racing challenge): 38.87 g blank
   to 8.85 g in 0.125 in Ti-5Al-2.5Sn, FOS 1.76 and 0.098 mm deflection. Both
   bell crank drawings (hero and sheet) are generated from
   `Bellcrank_0125in_8p85g.dxf` (dimensions in mm); `assets/bellcrank-fea.png`
   holds the stress plots.
2. **Suspension & Vehicle Dynamics** (Terps Racing): sub-team role and the
   anti-squat / anti-dive presentation, with a side-view geometry diagram.
3. **Autonomous Mission Robot** (ENES100): team lead and CAD lead. Drawings in
   `assets/otv-*.png` come from the Milestone 3 design report.
4. **Balsa Wood Truss Bridge**: 300+ lb school record.

Phone number and home address are left off on purpose, since the site is public.

## Updating it

- **New project:** copy an `<article class="project">` block, change the text, and
  update the "SHEET n OF m" labels. Put images in `assets/`.
- **Résumé link:** drop a PDF here as `resume.pdf` and add
  `<li><a class="btn" href="resume.pdf">Résumé (PDF)</a></li>` to the hero links.
  Consider a version without your street address.
- **Photos:** real photos of the robot or the Terps Racing car would make the
  biggest difference. Add them as extra `<figure class="shot">` blocks.

## Hosting

The cleanest URL is `https://bsifert.github.io/`:

1. Create a public GitHub repo named exactly `bsifert.github.io`.
2. Copy the contents of this folder into it and push.
3. In the repo's Settings → Pages, set the source to the `main` branch.

Netlify Drop (drag the folder onto app.netlify.com/drop) works too.
