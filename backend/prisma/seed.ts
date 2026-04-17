import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create a dummy user
  const hashedPassword = await bcrypt.hash('Password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'naman@example.com' },
    update: {},
    create: {
      email: 'naman@example.com',
      name: 'Naman',
      password: hashedPassword,
      subscriptionPlan: 'PRO',
      points: 120,
    },
  });

  console.log('Created User:', user.email);

  // 2. Create Tasks
  await prisma.task.createMany({
    data: [
      {
        userId: user.id,
        title: "Submit Startup Application",
        priority: "CRITICAL",
        category: "WORK",
        status: "PENDING",
        consequenceText: "Will miss the YC batch interview",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), // Due in 2 days
      },
      {
        userId: user.id,
        title: "Renew Domain Registration",
        priority: "HIGH",
        category: "FINANCE",
        status: "PENDING",
        consequenceText: "Website will go down, $50 penalty",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Due tomorrow
      },
      {
        userId: user.id,
        title: "Gym — Push Day",
        priority: "MEDIUM",
        category: "HEALTH",
        status: "COMPLETED",
      }
    ],
    skipDuplicates: true,
  });

  console.log('Created tasks!');

  // 3. Create Finance Items
  await prisma.financeItem.createMany({
    data: [
      {
        userId: user.id,
        name: "Apartment Rent",
        type: "BILL",
        amount: 25000,
        dueDay: 1, // 1st of month
        isRecurring: true,
        lateFeeAmount: 1000,
      },
      {
        userId: user.id,
        name: "AWS Hosting",
        type: "SUBSCRIPTION",
        amount: 3500,
        dueDay: 15,
        isRecurring: true,
      }
    ],
    skipDuplicates: true,
  });

  console.log('Created finance items!');

  // 4. Create Habits
  await prisma.habit.createMany({
    data: [
      {
        userId: user.id,
        name: "Morning Meditation",
        frequency: "DAILY",
        currentStreak: 5,
        longestStreak: 14,
        metricsData: {
          completions: 42,
          lastCompleted: new Date().toISOString()
        }
      },
      {
        userId: user.id,
        name: "Read 10 Pages",
        frequency: "DAILY",
        currentStreak: 12,
        longestStreak: 21,
      }
    ],
    skipDuplicates: true,
  });
  
  console.log('Created habits!');

  // 5. Create Goals
  await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Launch LifeAdmin V1",
      category: "WORK",
      targetDate: new Date('2026-12-31'),
      status: "IN_PROGRESS",
      milestones: {
        create: [
          { title: "Design Architecture", completed: true, order: 0 },
          { title: "Develop Backend API", completed: true, order: 1 },
          { title: "Deploy Frontend", completed: true, order: 2 },
          { title: "Get 100 Users", completed: false, order: 3 },
        ]
      }
    }
  });

  console.log('Created goals!');
  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
