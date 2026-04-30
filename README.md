# Browserslist Website

[![Website](https://img.shields.io/badge/site-browsersl.ist-2ea44f)](https://browsersl.ist/)
[![License: MIT](https://img.shields.io/github/license/browserslist/browsersl.ist)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.33.2-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

<img width="120" height="120" alt="Browserslist logo by Anton Popov" src="https://browsersl.ist/logo.svg" align="right">

This repository powers [browsersl.ist](https://browsersl.ist/), a web UI and HTTP API for testing [Browserslist](https://github.com/browserslist/browserslist) queries with live compatibility coverage from [Can I Use](https://github.com/Fyrd/caniuse).

## Table of Contents
- [What It Does](#what-it-does)
- [HTTP API](#http-api)
- [Quick Start](#quick-start)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)
- [License](#license)

## What It Does
- Parse and validate Browserslist queries in a browser-friendly interface.
- Show regional coverage and browser versions backed by `caniuse-lite`.
- Expose the same logic through a simple JSON API.
- Keep client and server packaged as a pnpm workspace.

## HTTP API
Use the API in your own tooling:

```text
https://browsersl.ist/api/browsers?q=defaults&region=alt-as
```

Parameters:
- `q`, Browserslist query or `.browserslist` config content. Defaults to `defaults`.
- `region`, optional region code. See [caniuse-lite/data/regions](https://github.com/browserslist/caniuse-lite/tree/main/data/regions).

### Example response
```json
{
  "config": ">0.3%",
  "lint": [
    {
      "id": "countryWasIgnored",
      "message": "Less than 80% coverage in `China`, `Nigeria`, `Tanzania`, `Ghana`, and `Uganda` regions"
    }
  ],
  "region": "alt-as",
  "coverage": 88.44,
  "versions": {
    "browserslist": "4.21.3",
    "caniuse": "1.0.30001381"
  },
  "updated": 1675156330646,
  "browsers": []
}
```

### Error response
Invalid requests return HTTP 400:

```json
{
  "message": "Unknown region name `XX`."
}
```

## Quick Start
### Prerequisites
- Node.js 24+
- pnpm 10.33.2+

### Install
```bash
pnpm install
```

### Run in development mode
```bash
pnpm start
```

This starts the local server and the client watcher via the workspace scripts.

### Build and test
```bash
pnpm build
pnpm test
```

### Run the production image locally
```bash
./scripts/run-image.sh
```

## Scripts
- `pnpm start`, run server plus client watcher.
- `pnpm build`, build all workspace packages.
- `pnpm test`, run lint, build, and package-level tests.
- `pnpm audit --prod`, audit production dependencies.

## Project Structure
```text
.
├── client/      # Vite frontend
├── server/      # Browserslist API server
├── lib/         # shared utilities
├── scripts/     # checks and helper scripts
└── Dockerfile   # container image build
```

## Development Notes
The root workspace expects Node.js `>=24`, while the package-level apps declare `>=18`. If you want the smoothest local setup, use the root requirement.

We also recommend EditorConfig, Prettier, and the configured lint tools for consistent formatting.

## License
Released under the [MIT License](LICENSE).
