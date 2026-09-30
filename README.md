<h1 align="center">mLaTeX Docs</h1>

<p align="center">
  <b>The documentation site for <a href="https://github.com/modern-latex/mlatex">mLaTeX</a>, a LaTeX typesetting engine rewritten from the ground up in modern C++.</b>
</p>

<p align="center">
  <a href="https://github.com/modern-latex/mlatex">Engine</a> ·
  <a href="https://github.com/modern-latex/mlatex/releases">Releases</a> ·
  <a href="https://www.npmjs.com/package/mlatex">npm</a> ·
  <a href="https://github.com/modern-latex/mlatex/issues">Issues</a>
</p>

---

This repository holds the guides, the command reference, the package reference, the changelog and the blog for mLaTeX. The engine itself lives in [modern-latex/mlatex](https://github.com/modern-latex/mlatex).

## Running it

You need Node 24 and pnpm 11.

```bash
pnpm install
```

```bash
pnpm --filter @mlatex/docs dev
```

The site is served on [localhost:3000](http://localhost:3000). Copy `apps/docs/.env.example` to `apps/docs/.env.local` for the parts that need keys: the GitHub token for higher API limits, OpenRouter and Upstash for the docs chat, and Typesense for search. Every page renders without them.

Before a pull request, run the checks the pre-commit hook runs:

```bash
pnpm lint
```

```bash
pnpm lint:spell
```

## Kept in step with mLaTeX

The site follows the engine on its own, so a release needs no change here.

- **Versions and changelog** are read from the engine's tags and GitHub releases, and refreshed every hour.
- **The Package Reference** and the Supported Packages page are written from the engine's sources by `apps/docs/scripts/reference.ts`. The [Reference workflow](.github/workflows/reference.yml) runs it as soon as mLaTeX's release workflow sends it the new tag, and once a day besides, and opens a pull request to read and merge. What the sources do not say, such as each package's subject, is in `apps/docs/scripts/reference.json`.
- **The code of conduct** is the engine's, copied from it by the same workflow.

## Contributing

Corrections and new pages are welcome as pull requests. A problem with the engine itself, such as a document that sets wrongly, belongs in the [engine's issues](https://github.com/modern-latex/mlatex/issues). Everyone taking part agrees to the [code of conduct](CODE_OF_CONDUCT.md), and security issues are reported privately, as [SECURITY.md](SECURITY.md) explains.

## Acknowledgements

This site began as a fork of the [Better Auth](https://github.com/better-auth/better-auth) documentation. I fell in love with its design, so the look of these pages, their layout and much of the component work come from it. My thanks to Bereket Engida and the Better Auth community for building something this good and sharing it openly. Their MIT license and copyright notice are kept in [LICENSE.md](LICENSE.md).
