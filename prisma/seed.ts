import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as bcrypt from 'bcrypt';
async function main() {
  const roundOfHash = 10;
  const passwordUser1 = await bcrypt.hash('password-user1', roundOfHash);
  const passwordUser2 = await bcrypt.hash('password-user2', roundOfHash);
  // seed user
  const user1 = await prisma.user.upsert({
    where: { username: 'user1' },
    update: {
      password: passwordUser1,
    },
    create: {
      id: 1,
      email: 'hyvong2805@gmail.com',
      username: 'user1',
      password: passwordUser1,
      sex: true,
      firstName: 'Nguyen',
      lastName: 'Khai',
      role: 'student',
      loginType: 'accessToken',
      status: true,
      verified: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'user2' },
    update: {
      password: passwordUser1,
    },
    create: {
      id: 2,
      email: 'nhkhai2805@gmail.com',
      username: 'user2',
      password: passwordUser2,
      sex: true,
      firstName: 'Nguyen',
      lastName: 'Khai',
      role: 'student',
      loginType: 'accessToken',
      status: true,
      verified: true,
    },
  });
  // seed credentials
  const user1Credential = await prisma.credentials.upsert({
    where: { userId: 1 },
    update: {
      lastPassword: 'not_set',
      version: 0,
      passwordUpdatedAt: new Date(),
    },
    create: {
      userId: 1,
      lastPassword: 'not_set',
      version: 0,
      passwordUpdatedAt: new Date(),
    },
  });

  const user2Credential = await prisma.credentials.upsert({
    where: { userId: 2 },
    update: {
      lastPassword: 'not_set',
      version: 0,
      passwordUpdatedAt: new Date(),
    },
    create: {
      userId: 2,
      lastPassword: 'not_set',
      version: 0,
      passwordUpdatedAt: new Date(),
    },
  });

  console.log(user1, user2, user1Credential, user2Credential);
}

// execute the main func
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
