# MYTHERA

> An interpretive studio for interactive philosophical and cultural works.

Mythera builds explorable worlds for the structures people live inside but cannot
see — across philosophy, identity, literature, and cultural form. This repository
contains the source for the studio's website, [mythera.studio](https://mythera.studio).

## Overview

The site is a static, dependency-free landing page built with plain HTML, CSS, and
vanilla JavaScript. It presents the studio's vision, the **Three Realms** that frame
its work, and a catalogue of featured works, each with its own share/landing page.

## The Three Realms

| # | Realm | Theme |
|---|-------|-------|
| I | Self / Systems / Subject Formation | The invisible architectures that shape who we become. |
| II | Literature / Self / Performance | Where sincerity meets spectacle and identity becomes role. |
| III | Aesthetics / Interpretation / Form | The hidden structure of beauty made experientially legible. |

## Works

- **Second Self** (Flagship · Realm I) — An online philosophical card game. Design a
  society and confront the kind of human subject it produces.
- **Narrative Drift** (Realm I) — A simulation of how ordinary platform choices
  gradually reshape the self.
- **Mishima Atlas** (Realm II) — A navigable conceptual map of Mishima's universe.
- **Existential Wager** (Realm I · II) — A simulation of a principle lived so
  faithfully that it becomes theatre.
- **LitPulse** (Realm III) — An interface for the emotional motion and structural
  pulse of literature.
- **Scoreless** (Realm III) — A music interface for feeling form, tension, and
  movement without reading notation.

## Project Structure

```
.
├── index.html              # Main landing page
├── styles.css              # All styling
├── main.js                 # Scroll reveal, hero parallax, smooth-scroll nav
├── vercel.json             # Deployment config + clean-URL rewrites
├── works/                  # Dedicated share/landing pages per work
│   ├── second-self.html
│   ├── narrative-drift.html
│   └── theatre-of-authenticity.html
└── public/
    └── images/             # Logos, wordmarks, OG images, artwork
```

## Development

No build step or dependencies are required. Clone the repo and open `index.html`
directly, or serve the folder locally:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit `http://localhost:8000`.

## Deployment

The site is deployed on [Vercel](https://vercel.com). `vercel.json` sets the project
root as the output directory (no build command) and defines clean-URL rewrites so
`/works/second-self` resolves to `works/second-self.html`.

## Credits

Built by **[Risa Koyanagi](https://risakoyanagi.com)** — a creator of interpretive
worlds working where philosophy, aesthetics, systems, and cultural form meet.

© All rights reserved.
