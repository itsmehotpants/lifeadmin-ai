FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations (for monorepo handling)
COPY package*.json ./
COPY tsconfig*.json ./

# Copy packages and backend
COPY packages ./packages
COPY backend ./backend

# Install dependencies
RUN npm install

# Generate Prisma Client
WORKDIR /app/backend
RUN npx prisma generate

# Build backend and shared packages
WORKDIR /app
RUN npm run build --workspace=backend

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma

WORKDIR /app/backend

EXPOSE 3001

CMD ["npm", "start"]
