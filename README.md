# Olorunmaiye Peter — portfolio

A static site: plain HTML, CSS and JavaScript, so there's no build step and nothing to install.

```
index.html        the page
css/styles.css    all styles, including both light and dark themes
js/main.js        theme switch, menu, scroll animations, counters, clock
images/           photo and project charts (same names as the current site)
favicon.svg       "OP" tab icon
```

## Before going live

1. **LinkedIn**: in `index.html`, search for `[handle]` and replace it with the LinkedIn handle.
2. **CV**: add the PDF to the repo root as `cv.pdf`. Both "Download CV" buttons link to it.
3. Optional: when there's a new project, copy one `<article class="card ...">` block in the Work section and edit it. `card-1`, `card-2` and `card-3` set the colour tint.

## Deploy to GitHub Pages (ayanfedara.github.io)

1. Open the `AyanfeDara/ayanfedara.github.io` repository.
2. Replace the old site files with everything in this folder, keeping the same folder structure.
3. Commit to `main`. GitHub Pages republishes in a minute or two.

From the command line:

```bash
git clone https://github.com/AyanfeDara/ayanfedara.github.io.git
cd ayanfedara.github.io
# copy the contents of this folder in, overwriting index.html and images/
git add -A
git commit -m "New portfolio design with light and dark mode"
git push
```

## How it behaves

- **Light/dark mode**: the first visit follows the visitor's system setting. The sun/moon button in the nav switches theme and remembers the choice.
- **Intro screen**: the orange "Hello." screen plays once per browser session.
- **Motion**: the headline rises in word by word, the tool strips scroll, numbers count up and sections fade in as you scroll. On desktop the project cards stack as you scroll.
- **Accessibility**: if a visitor has turned on "reduce motion", all animation is switched off. The site can also be used with the keyboard alone.
- **Local time**: the Abuja clock updates live.
