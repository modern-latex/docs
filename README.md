# mLaTeX Docs

Everything you read about mLaTeX is written here: how to install it, how to set a document, how to call it from C, C++, Python or JavaScript, what every command and package does, and what changed in each release.

## What's on the site

- **Guides** for getting started, the command line, moving over from another TeX, and the problems people run into most.
- **Typesetting** pages, one per subject: mathematics, tables, pictures, diagrams, bibliographies, slides, languages and more.
- **Embedding**, for running mLaTeX inside your own program instead of from a terminal.
- **The Command and Package Reference**, written from mLaTeX's own sources rather than by hand, so it can't drift from what mLaTeX actually supports.
- **The changelog and the blog.**

There's also a docs chat that searches the pages and mLaTeX's code, and full-text search across the site.

## Working on it

Node 24 and pnpm 11, then:

```bash
pnpm install
```

```bash
pnpm --filter @mlatex/docs dev
```

It opens on [localhost:3000](http://localhost:3000). Every page renders with no setup. The chat, search and higher GitHub API limits need keys: copy `apps/docs/.env.example` to `apps/docs/.env.local` and fill in what you want.

Pages are MDX under `apps/docs/content/docs`. Before opening a pull request, run what the pre-commit hook runs:

```bash
pnpm lint
```

```bash
pnpm lint:spell
```

## What updates itself

A new mLaTeX release needs nothing from this repo.

- The version picker and the changelog come straight from mLaTeX's tags and GitHub releases, refreshed hourly.
- The Package Reference and the Supported Packages page are rebuilt by `apps/docs/scripts/reference.ts`. The [Reference workflow](.github/workflows/reference.yml) runs it when a release goes out, and daily besides, then opens a pull request. Anything the sources can't say, like which subject a package belongs to, lives in `apps/docs/scripts/reference.json`.
- The code of conduct is copied over from mLaTeX by the same workflow.

## Contributing

Spotted a mistake, or a page that's missing? Pull requests are welcome. [CONTRIBUTING.md](CONTRIBUTING.md) explains how. If a document sets wrongly, that's a bug in mLaTeX itself, so it goes in [its issues](https://github.com/modern-latex/mlatex/issues) rather than here.

By taking part you agree to the [code of conduct](CODE_OF_CONDUCT.md). Please report security issues privately, as [SECURITY.md](SECURITY.md) describes.

## Acknowledgements

This site started life as a fork of the [Better Auth](https://github.com/better-auth/better-auth) docs. I fell in love with that design, and the look, the layout and a lot of the components here come from it. Thank you to Bereket Engida and the Better Auth community for building something this good and sharing it openly. Their MIT license and copyright notice are kept in [LICENSE.md](LICENSE.md).
