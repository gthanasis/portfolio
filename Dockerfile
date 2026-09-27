# Build both static sites, then serve them from nginx. Nothing from the build
# stage reaches the final image: no node_modules, no source, no toolchain.

FROM node:24-alpine AS build
WORKDIR /app

# Dependencies first, as their own layer: source changes far more often than
# the lockfile, so rebuilds skip the install.
COPY package.json package-lock.json ./
COPY apps/site/package.json apps/site/
COPY apps/cv/package.json apps/cv/
COPY packages/ui/package.json packages/ui/
RUN npm ci --no-audit --no-fund

COPY . .

# Where the contact form posts (the n8n webhook). Public by design: it ends up
# in the browser bundle either way. Unset means the form falls back to email.
ARG NEXT_PUBLIC_CONTACT_ENDPOINT=""
ENV NEXT_PUBLIC_CONTACT_ENDPOINT=$NEXT_PUBLIC_CONTACT_ENDPOINT
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---

# The unprivileged variant: runs as a non-root user throughout and listens on 8080.
FROM nginxinc/nginx-unprivileged:1.31-alpine AS runtime

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/apps/site/out /usr/share/nginx/site
COPY --from=build /app/apps/cv/out /usr/share/nginx/cv

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
