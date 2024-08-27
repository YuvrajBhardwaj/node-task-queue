import fs from 'fs';
import path from 'path';
import { createClient } from './redisClient.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Use __dirname for consistent path handling
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

async function queueTask(userId, taskData) {
  const client = createClient();
  await client.lPush('taskQueue', JSON.stringify({ userId, ...taskData }));
}

async function processTasks(userId) {
  const client = createClient();
  const tasks = await client.lRange('taskQueue', 0, -1);

  for (const task of tasks) {
    const { userId: taskUserId, ...taskData } = JSON.parse(task);
    if (taskUserId === userId) {
      console.log('Processing task:', taskData);
      await taskProcessor(userId); // Updated function name to avoid conflict
      await client.lRem('taskQueue', 0, task);
    }
  }
}

async function logTaskCompletion(userId) {
  const logFilePath = path.join(logDir, `task-completion-${userId}.log`);
  try {
      await fs.promises.appendFile(logFilePath, `Task completed for user ${userId} at ${new Date().toISOString()}\n`);
      console.log(`Logged task completion for user ${userId}`);
  } catch (err) {
      console.error('Failed to log task completion:', err);
  }
}

async function taskProcessor(userId) {
  console.log(`${userId}-task completed at-${Date.now()}`);
  const logFilePath = path.join(logDir, `task-completion-${userId}.log`);
  try {
      await fs.promises.appendFile(logFilePath, `Task completed for user ${userId} at ${new Date().toISOString()}\n`);
  } catch (err) {
      console.error('Failed to log task completion:', err);
  }
}

export { queueTask, processTasks, logTaskCompletion, taskProcessor };
