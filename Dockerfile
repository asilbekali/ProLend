# syntax=docker/dockerfile:1

# TH-LABS landing page — Next.js 16, standalone output.
#
# The thing to know before editing: NEXT_PUBLIC_* variables are inlined into
# the client bundle by `next build`. They are build-time inputs, not runtime
# ones — setting them in docker-compose changes nothing about an already-built
# image. They are therefore ARGs here, and the workflow passes them at build.
# Server-only values (BACKEND_API_URL, GOOGLE_AUTH_SECRET, SMTP_*) are read by
# route handlers at request time and stay out of the image entirely.

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1


# ── dependencies ────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
# `npm ci` is preferred but falls back: package-lock.json is generated on
# Windows and omits the platform packages npm needs on Linux for the
# wasm-fallback bindings (@emnapi/*). `npm ci` is strict about that mismatch
# and aborts; `npm install` resolves them. Regenerating the lockfile on Linux
# would let the `ci` path win again. Same trade-off as deploy/modal in the
# TH-Labs-full repo.
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund


# ── build ───────────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Baked into the client bundle — see the note at the top of this file.
ARG NEXT_PUBLIC_MAIN_APP_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_MAIN_APP_URL=${NEXT_PUBLIC_MAIN_APP_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}

RUN npm run build
# Catch a missing standalone build here rather than at container start, where
# it would surface as "Cannot find module '/app/server.js'".
RUN test -f .next/standalone/server.js


# ── runtime ─────────────────────────────────────────────────────────────────
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# standalone/ already contains the traced subset of node_modules and server.js.
# public/ and .next/static are deliberately excluded from it by Next, so they
# are copied separately — without them the site renders with no CSS, fonts, or
# images and every static asset 404s.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
