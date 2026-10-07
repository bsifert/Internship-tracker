# Portfolio site

A one-page static site for showing projects to employers. It is plain HTML and
CSS with no build step: open `index.html` in a browser to preview it.

## Before you send it

Search `index.html` for `EDIT:` comments and for `class="todo"`. Anything
highlighted yellow on the page is a placeholder:

- major and graduation year
- résumé PDF (drop it in this folder as `resume.pdf`)
- LinkedIn URL
- contact email
- location and the tools you know

When a placeholder is filled in, remove its `<span class="todo">` wrapper.

## Adding a project

Copy one `<article class="project">` block, paste it below the last one, and
change the text and links. Put images in `assets/`.

## Screenshots

The Internship Tracker screenshots use made-up company names, so your real
target list isn't shown.

## Hosting

The cleanest URL is `https://bsifert.github.io/`:

1. Create a public GitHub repo named exactly `bsifert.github.io`.
2. Copy the contents of this folder into it and push.
3. In the repo's Settings → Pages, set the source to the `main` branch.

Netlify Drop (drag the folder onto app.netlify.com/drop) works too.
