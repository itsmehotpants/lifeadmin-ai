FROM node:20-alpine AS builder
WORKDIR /app

# Environment variables must be present at build time for Next.js to bake them into static pages
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN npm install

WORKDIR /app/apps/web
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# You only need the standalone output and public folder
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Next.js sets port dynamically via ENV var
ENV PORT=3000
EXPOSE 3000

# Start standalone server
CMD ["node", "apps/web/server.js"]
