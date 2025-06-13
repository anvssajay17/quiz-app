
import { Router } from 'express';
import db from '../db.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [[user]] = await db.execute('SELECT username FROM users WHERE id = ?', [userId]);

    const [[stats]] = await db.execute(
      `SELECT 
         COUNT(*) AS total_attempts,
         SUM(score) AS total_correct
       FROM user_attempts
       WHERE user_id = ?`,
      [userId]
    );

    const totalAttempts = stats.total_attempts || 0;
    const totalCorrect = stats.total_correct || 0;

    res.json({
      username: user.username,
      stats: {
        totalAttempts,
        totalCorrect,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

export default router;
