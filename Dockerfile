# Build the SPA, then serve the resulting files from nginx. Nothing from the
# build stage reaches the final image — no node_modules, no source, no
# toolchain — so the thing that runs in the cluster is static files and a
# web server.

# Node 18, not something newer: this is an Nx 13 / webpack 4-era workspace
# from 2022 and its dependency tree predates Node 20's OpenSSL 3 change,
# which breaks the build with ERR_OSSL_EVP_UNSUPPORTED.
FROM node:18-alpine AS build

WORKDIR /app

# @parcel/watcher in this dependency tree ships no prebuilt binary for musl,
# so yarn falls back to compiling it with node-gyp and Alpine has no
# toolchain. Only the build stage needs these; the runtime image is nginx.
RUN apk add --no-cache python3 make g++

# Dependencies first, as their own layer: source changes far more often than
# the lockfile, so rebuilds skip the slow install.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY . .

# NX_DAEMON off because the daemon expects a long-lived workspace and only
# adds a background process to a single-shot container build.
ENV NX_DAEMON=false
RUN yarn nx build cv --configuration=production

# ---

# The unprivileged variant rather than plain nginx: the stock image assumes it
# starts as root to create /var/cache/nginx and drop privileges afterwards, so
# simply adding `USER nginx` to it fails at boot with a permission error on
# client_temp. This one is built to run as an unprivileged user throughout and
# already listens on 8080.
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/packages/cv /usr/share/nginx/html

EXPOSE 8080

# Fail the container if nginx stops serving, rather than leaving a process
# that is up but not answering.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
