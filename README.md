# gthanasis.com + cv.gthanasis.com

Two static sites from one repo, served by one nginx image.

| Path | Site | What |
|---|---|---|
| `apps/site` | gthanasis.com | Personal site: agentic coding, GitHub activity, results, projects, contact |
| `apps/cv` | cv.gthanasis.com | The CV, printable to A4 |
| `packages/ui` | both | Design tokens (`tokens.css`) and base styles (`base.css`) |
| `deploy/` | both | nginx config and the Kubernetes manifests |

Both are Next.js with `output: 'export'`: the build is plain files, and
`deploy/nginx.conf` picks the site by `Host`.

## Develop

```sh
npm install
npm run dev:site   # http://localhost:3000
npm run dev:cv
```

`npm run build`, `npm run lint` and `npm run typecheck` cover both apps.

## Content

- CV: `apps/cv/src/lib/cv.ts`. `**text**` in a bullet renders as a highlighted metric.
- Site facts (name, role, links): `apps/site/src/lib/site.ts`. Sections live in
  `apps/site/src/components`.

## Build-time data and settings

- **GitHub activity** is fetched while building, so it is in the HTML. The deploy
  workflow runs daily to keep it current.
- **Contact form** posts `{ idea, email, name, source }` as JSON to
  `NEXT_PUBLIC_CONTACT_ENDPOINT` (set the `CONTACT_ENDPOINT` repository variable;
  intended for the n8n webhook). Unset, the form opens the visitor's mail client.

## Deploy

Pushing to `main` builds the image, pushes it to GHCR and rolls it out to the
`portfolio` namespace (see `.github/workflows/deploy.yml`). The Ingress already
routes both hostnames to the one Service.

```sh
docker build -t portfolio .
docker run -p 8080:8080 portfolio
curl -H 'Host: cv.gthanasis.com' localhost:8080/
```
