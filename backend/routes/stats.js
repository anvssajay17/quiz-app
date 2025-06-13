import { Router } from 'express';
import db from '../db.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

// ✅ GET /stats/:category_id - fetch stats
router.get('/:category_id', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const categoryId = parseInt(req.params.category_id);

  if (isNaN(categoryId)) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  try {
    const [stats] = await db.execute(
      `SELECT 
         COUNT(*) AS total_attempts,
         SUM(score) AS correct_answers,
         ROUND(SUM(score) * 100.0 / COUNT(*), 1) AS accuracy
       FROM user_attempts
       WHERE user_id = ? AND category_id = ?`,
      [userId, categoryId]
    );

    res.json(stats[0] || {
      total_attempts: 0,
      correct_answers: 0,
      accuracy: 0,
    });
  } catch (err) {
    console.error('❌ Stats fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
