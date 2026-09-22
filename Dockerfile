# Production image for danfenodejs (XML → DANFE PDF, in-memory)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8090

RUN addgroup -S danfe && adduser -S danfe -G danfe

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

RUN chown -R danfe:danfe /app

USER danfe

EXPOSE 8090

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8090/health || exit 1

CMD ["npm", "start"]
