# DRA Framework ©

Public website for the **DRA (DevOps Reference Architecture) Framework** — a research-driven reference architecture for designing, deploying, and evaluating multi-cloud IoT applications using DevOps principles.

🔗 **Live site:** <https://georges034302.github.io/dra-framework/>

---

## About

The DRA Framework formalises a layered architecture for DevOps-enabled, multi-cloud IoT systems. The site presents the framework's models and characteristics as browsable cards, alongside the underlying publications and concrete DRA instances (DRAv1.0 and DRAv2.0).

Content is organised into three areas:

- **Framework models** — Contextual, Conceptual, Logical, Physical, Operational, Composition.
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
└── LICENSE.MD
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

Copyright © Georges Bou Ghantous. All rights reserved.

This project is **source-available**, not open source. You may:

- ✅ View and study the source code.
- ✅ Use it for personal, educational, and internal development purposes.
- ✅ Reference the DRA Framework in academic work with proper citation.

You may **not**:

- ❌ Redistribute, sublicense, or sell any part of this project.
- ❌ Use the content, diagrams, or branding in commercial products without prior written permission.
- ❌ Remove or alter copyright and attribution notices.

For licensing enquiries or permission requests, please contact the author via the links above.

See [LICENSE.MD](LICENSE.MD) for the full license text.

---

<p align="center">
  <sub><sup><span style="color:#9aa0a6">Author: Georges Bou Ghantous © 2020</span></sup></sub>
</p>
