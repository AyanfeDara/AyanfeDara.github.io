# Olorunmaiye Peter: portfolio

A static site: plain HTML, CSS and JavaScript, so there's no build step and nothing to install. Live at https://ayanfedara.github.io.

```
index.html        the page
css/styles.css    all styles, including both light and dark themes
js/main.js        theme switch, menu, scroll animations, counters, clock, project loops
media/            project loops: <name>.mp4/.webm for desktop, <name>_m.* portrait cuts for phones, plus posters
images/           photos, original chart images and og-image.png (the link preview)
cv.pdf            the CV both "Download CV" buttons download
favicon.svg       "OP" tab icon
```

## To do

1. **LinkedIn**: the button is commented out in `index.html` (contact section). Replace `[handle]` with the real profile handle and remove the comment markers.
2. **Adding a project**: projects are grouped by tool (SQL, Power BI, Python, R). Copy one `<article class="card ...">` block into the right group's `<div class="rail">` in the Work section and edit it; the project count, arrows and "2 / 3" counter update by themselves. For a new tool such as Excel, copy a whole `<div class="tool-group">` block and change the tool name. Each project's chart loop goes in `media/` as `<name>.mp4`, `<name>.webm` and `<name>_poster.webp`, plus `_m` portrait versions for phones.

## Deploy

Commit to `main`. GitHub Pages republishes in a minute or two. Releases are tagged (`v3.0`, `v3.1`, ...).

## How it behaves

- **Light/dark mode**: the first visit follows the visitor's system setting. The sun/moon button switches theme and remembers the choice.
- **Intro screen**: the orange "Hello." screen plays once per browser session.
- **Motion**: the headline rises in word by word, the tool strips scroll, numbers count up and sections fade in as you scroll. Each tool's projects slide sideways with arrows, keyboard arrows or a swipe. Rows with more than one project also advance by themselves every 10 seconds; they pause on hover or while off screen, stop once the visitor uses the arrows, and stay still with "reduce motion".
- **Project loops**: each project chart is a short silent video. Only the card on screen plays; phones get the portrait cut with larger text.
- **Accessibility**: if a visitor has turned on "reduce motion", all animation is switched off and the loops show a still image. The site can also be used with the keyboard alone.
- **Local time**: the Abuja clock updates live.
