# Contributing

Contributions are welcome, from a fixed typo to a whole new page. For anything
large, such as a new section or a change to how the site works, please open an
issue first so we can talk it through before you start.

A document that sets wrongly, a command that's missing or a crash is a bug in
mLaTeX itself, not in these pages. Report it in
[the engine's issues](https://github.com/modern-latex/mlatex/issues) instead.

## Getting set up

You need Node 24 and pnpm 11.

```bash
git clone https://github.com/modern-latex/docs.git
```

```bash
pnpm install
```

```bash
pnpm --filter @mlatex/docs dev
```

The site opens on [localhost:3000](http://localhost:3000). Every page renders
without any keys. Copy `apps/docs/.env.example` to `apps/docs/.env.local` only
if you're working on the chat, search or contact form.

## Writing a page

Pages are MDX under `apps/docs/content/docs`, and each folder's `meta.json`
sets the order they appear in the sidebar.

- Say what mLaTeX does today. Anything planned but not shipped is marked as
  such.
- Every example should set in mLaTeX as written. Try it before you send it.
- Don't edit the Package Reference or the Supported Packages page by hand.
  They're rebuilt from the engine's sources by `apps/docs/scripts/reference.ts`,
  and a hand edit is lost on the next run. To change what the sources can't say,
  such as which subject a package belongs to, edit
  `apps/docs/scripts/reference.json`.
- Don't edit `CODE_OF_CONDUCT.md` either. It's copied from the engine.

## Pull requests

Pull requests should:

- pass the checks the pre-commit hook runs, `pnpm lint` and `pnpm lint:spell`;
- pass `pnpm typecheck` when they touch code;
- add any real word the spell checker doesn't know to the matching list in
  `.cspell`, rather than turning the check off;
- keep to one change each, so they're easy to read and to revert.

The hook installs itself with `pnpm install`. It formats what you stage with
Biome and remark, and spell-checks it.

## Conduct and security

Everyone taking part is expected to follow the
[Code of Conduct](CODE_OF_CONDUCT.md). Please don't report a security issue in
a public issue or pull request; follow [SECURITY.md](SECURITY.md) instead.

## Questions

Ask on the project's [Discord server](https://discord.gg/UUbPg5YtJF), where
contributions and the project's direction are discussed too.
