# DRA Framework ©

Public website for the **DRA (DevOps Reference Architecture) Framework** — a research-driven reference architecture for designing, deploying, and evaluating multi-cloud IoT applications using DevOps principles.

🔗 **Live site:** <https://georges034302.github.io/dra-framework/>

![version](https://img.shields.io/badge/release-v2.0-21949c)

---

## Release v2.0 — highlights

- **New dashboard UI** — dark sidebar, soft-shadow card grid, refined typography.
- **SPA-style navigation** — in-place page swaps between Overview, DRA v1.0, and DRA v2.0 with no full reload or flash.
- **Persistent sidebar** — author block and theme toggle (Light/Dark) render on first paint across every page.
- **Image library cleanup** — diagram assets renamed to match their card filenames (`dra_<card>.png`); legacy PascalCase names retired.
- **Content normalization** — all card descriptions tuned to a consistent length for visual parity.
- **Dual licensing retained** — MIT for code, view-only for DRA research content.

---

## About

The DRA Framework formalises a layered architecture for DevOps-enabled, multi-cloud IoT systems. The site presents the framework's models and characteristics as browsable cards, alongside the underlying publications and concrete DRA instances (DRAv1.0 and DRAv2.0).

Content is organised into three areas:

- **Framework models** — Contextual, Conceptual, Logical, Physical, Operational.
- **Framework characteristics** — Abstraction, Human Factor, Infrastructure, Process, Tools, Product, Business Value, Rules, Legal.
- **DRA instances** — DRAv1.0 and DRAv2.0 reference deployments with IoT device tables and demo packages.

The site is built as a lightweight static website (plain HTML, CSS, vanilla JS) using Bootstrap 4 for layout. Page sections are composed from reusable HTML partials loaded at runtime via a small `data-include` helper.

---

## Project structure

```text
.
├── index.html              # Landing page, composes all card and partial includes
├── css/
│   └── main.css            # Site styles (navbar, cards, tables, .btn-steel)
├── js/
│   └── include.js          # data-include loader + View PNG / Back handlers
├── pages/
│   ├── dra1.html           # DRAv1.0 instance page
│   ├── dra2.html           # DRAv2.0 instance page
│   ├── cards/              # Card partials included into index.html
│   └── partials/           # Shared header, publications, about-author
├── media/
│   ├── images/             # Diagrams referenced by the cards and DRA pages
│   └── profile/            # Author profile image
├── README.md
├── LICENSE                 # MIT — covers website code (HTML/CSS/JS scaffolding)
└── LICENSE-content.md      # View-only — covers DRA content, diagrams, branding
```

---

## Author

**Georges Bou Ghantous** — Researcher and author of the DRA Framework.

- LinkedIn: <https://www.linkedin.com/in/georges-bou-ghantous/>
- UTS Profile: <https://www.uts.edu.au/staff/georges.boughantous-1>
- GitHub: <https://github.com/Georges034302>
- ORCID: <https://orcid.org/0000-0003-3732-7085>
- Google Scholar: <https://scholar.google.com/citations?user=3Wjd5tYAAAAJ&hl=en>

---

## License

This repository is **dual-licensed** to keep the website code reusable while protecting the DRA Framework's research content.

### Code — MIT License

The website scaffolding (HTML structure, CSS, JavaScript under `css/`, `js/`, and the structural markup in `index.html` / `pages/**/*.html`) is released under the **MIT License**. You may freely reuse the code with attribution. See [LICENSE](LICENSE).

### Content — View-Only

The DRA Framework **research content** is *not* open source and is provided for **viewing and academic reference only**. This includes:

- All diagrams and images under `media/`.
- The textual descriptions of the DRA models, characteristics, and instances in `pages/cards/`, `pages/dra1.html`, `pages/dra2.html`, and the partials in `pages/partials/`.
- The DRA Framework name and branding.

Without prior written permission you may **not** copy, redistribute, modify, or commercially use this content. Academic citation with proper attribution is welcome.

See [LICENSE-content.md](LICENSE-content.md) for the full content license.

For licensing enquiries or permission requests, please contact the author via the links above.

---

<p align="center">
  <sub><sup><span style="color:#9aa0a6">Author: Georges Bou Ghantous © 2020</span></sup></sub>
</p>
