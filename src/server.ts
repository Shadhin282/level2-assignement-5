import { Server } from 'http';
import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

let server: Server;

process.on('uncaughtException', async (err) => {
  console.error('UNCAUGHT EXCEPTION 💥 Shutting down...');
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});

async function main() {
  try {
    await prisma.$connect();
    console.log('🛢️ Database connection successful');

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION 💥 Shutting down...');
  console.error(err);

  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(1);
    });
  } else {
    prisma.$disconnect().then(() => process.exit(1));
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED 💥 Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Process terminated!');
      process.exit(0);
    });
  } else {
    prisma.$disconnect().then(() => process.exit(0));
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT RECEIVED 💥 Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Process terminated!');
      process.exit(0);
    });
  } else {
    prisma.$disconnect().then(() => process.exit(0));
  }
});
