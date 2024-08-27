import express from 'express';
import routes from './routes.js';
import { createClient } from './redisClient.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    await new Promise((resolve) => server.close(resolve));
    console.log('Server closed');
    const client = createClient();
    await client.quit();
    console.log('Redis client closed');
  } catch (err) {
    console.error('Error during shutdown:', err);
  }
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown();
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});
