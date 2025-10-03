FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm i

COPY . ./

ARG NUXT_PUBLIC_SITE_URL
ARG REDIS_URL
RUN pnpm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/.output/ ./

ENV NODE_ENV=production

CMD ["node", "/app/server/index.mjs"]
