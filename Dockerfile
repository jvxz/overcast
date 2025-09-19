FROM node:22-alpine AS build

ARG RAILWAY_ENVIRONMENT

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm i

COPY . ./

RUN pnpm run build

FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/.output/ ./

ENV NODE_ENV=production

CMD ["node", "/app/server/index.mjs"]
