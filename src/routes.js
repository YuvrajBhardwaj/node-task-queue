import express from 'express';
import rateLimit from 'express-rate-limit';
import { queueTask, processTasks, logTaskCompletion } from './taskProcessor.js';

const router = express.Router();

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each user ID to 20 requests per minute
  keyGenerator: (req) => req.body.user_id, // Use user_id for rate limiting
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests' });
  },
});

router.post('/api/v1/task', rateLimiter, async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  try {
    await queueTask(user_id, req.body);
    await processTasks(user_id);
    await logTaskCompletion(user_id);
    res.status(200).json({ message: 'Task queued successfully' });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
