# LifeAdmin AI 🧠⚡
**The Operating System for Your Personal Life**

A full-stack, AI-powered life management dashboard built for web and mobile. LifeAdmin acts as an intelligent assistant to automate your tasks, balance your finances, generate push notification warnings using generative AI (Gemini 2.0 Flash) when deadlines are close, and track your daily habits. 

---

## 🏗️ Architecture Stack
*   **Monorepo**: Turbo/npm workspace structure.
*   **Web App**: Next.js 15, React 19, Tailwind CSS v4, Zustand, TanStack React Query.
*   **Mobile App**: React Native (Expo SDK), React Navigation, AsyncStorage, notifications.
*   **Backend API**: Express.js, TypeScript, RESTful structure.
*   **Database**: PostgreSQL, Prisma ORM.
*   **Queue/Workers**: BullMQ, Redis (Handles midnight crons, AI text-generation jobs, push notifications).
*   **AI Integrations**: Google Gemini 2.0 Flash (`consequenceText` deadline processing over natural language payload mapping).
*   **Cloud Integrations**: Firebase Admin SDK (FCM Cloud Messaging), Stripe / Razorpay Dual Gateways.

---

## 🚀 Quickstart via Docker

Assuming you have Docker Desktop installed, spinning up the entire LifeAdmin ecosystem (Postgres, Redis, API, and Next.js Web) takes just 1 command:

```bash
# Boot up the stack
docker-compose up --build
```
*The stack will automatically map the network databases, route the `DATABASE_URL`, execute the Prisma database migrations, run the Mock UI seeding script, and map `localhost:3000` to the Next.js Frontend.*

---

## 🛠️ Local Development (Manual Setup)

If you wish to spin up services manually to edit code:

### 1. Requirements
*   Node.js v20+
*   Local PostgreSQL Database running
*   Local Redis Instance running

### 2. Environment Setup
Populate your `.env` variables located in both the root `./` and `./backend/`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/lifeadmin"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your_secret_crypto_hash"
GEMINI_API_KEY="AIzaSy..." 
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### 3. Installation & Run
```bash
# 1. Install all dependencies across the monorepo
npm install

# 2. Push Prisma database schema config
cd backend
npx prisma migrate dev --name init

# 3. Seed your database with mock users
npx prisma db seed

# 4. Start the development servers
npm run dev
```

---

## 📱 Running the Mobile App
You will need the Expo Go app installed on your physical device.

```bash
cd apps/mobile
npm install

# Start the Expo Metro Bundler
npx expo start
```
*Note: Because React Native runs on your phone physically, it cannot resolve `localhost` API endpoint addresses by default. Update the `API_URL` variable found inside `apps/mobile/src/store/auth.store.ts` to map to your computer's local IP address (`192.168.x.x`) to successfully authenticate with your local Express API.*

---

## ⚖️ License
Proprietary Platform. All rights reserved.
