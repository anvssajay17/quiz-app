import { Router } from 'express';
import db from '../db.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { question_id, category_id, user_answer, score } = req.body;

  if (!question_id || !category_id || !user_answer || typeof score !== 'boolean') {
    return res.status(400).json({ error: 'Missing or invalid attempt data' });
  }

  try {
    await db.execute(
      `INSERT INTO user_attempts (user_id, category_id, question_id, user_answer, score)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, category_id, question_id, user_answer, score]
    );

    res.json({ success: true, message: 'Attempt recorded' });
  } catch (err) {
    console.error('❌ Attempt save error:', err.message);
    res.status(500).json({ error: 'Failed to save attempt' });
  }
});

export default router;
