# Security Policy

This repository is the mLaTeX documentation site. A flaw in the engine
itself -- the `mlatex` command line, its libraries, the WebAssembly module or
its packages -- belongs to the engine's own policy, in
[modern-latex/mlatex's SECURITY.md](https://github.com/modern-latex/mlatex/blob/main/SECURITY.md).

## Supported versions

The site is deployed from `main`, and only what is deployed is supported.

## Reporting a vulnerability

**Please do not report security issues in public issues, pull requests or
discussions.**

Report them privately in one of two ways:

- through GitHub's private vulnerability reporting, using **Report a
  vulnerability** on this repository's **Security** tab; or
- by email to andromedeyz@hotmail.com, with `mLaTeX docs security` in the
  subject line.

Please include the page or route, the steps that reproduce the issue, and
what an attacker gains.

### What to expect

| Step                                                | Target                                      |
|-----------------------------------------------------|---------------------------------------------|
| Acknowledgement of your report                      | within 3 business days                      |
| Initial assessment and severity                     | within 10 business days                     |
| Fix for a confirmed critical or high-severity issue | as soon as possible, usually within 30 days |

Please allow up to 90 days for a fix before disclosing the issue publicly.

## Scope

In scope: the site's own code in this repository -- its pages, its API
routes (the docs chat, the image routes and the search sync), the workflows
under `.github`, and the components in `packages/ui`.

Out of scope: the engine, as above; the services the site uses, such as
GitHub, OpenRouter, Upstash, Typesense and its host, whose flaws go to their
own projects; and rate limits being reached by ordinary heavy use.
