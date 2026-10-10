# Portfolio site

A one-page static site for showing my projects to employers. It is plain HTML and
CSS with no build step: open `index.html` in a browser to preview it.

## What's on it

1. **Autonomous Mission Robot** (ENES100, Fall 2025): team lead and CAD lead.
   Drawings in `assets/otv-*.png` come from the Milestone 3 design report.
2. **Terps Racing Suspension**: vehicle dynamics and suspension sub-team, with the
   anti-squat / anti-dive brief and a side-view geometry diagram.
3. **Internship Tracker**: the React app in this repo.
4. **Balsa Wood Truss Bridge**: Project Lead the Way, 300+ lb school record.
5. **Engineering Research & Writing**: ENES200 brake-caliper case study, JOUR130 paper.

Then work experience, leadership, skills and coursework, and contact details.

Phone number, home address and GPA are left off on purpose, since the site is
public. Employers get those from the résumé.

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
