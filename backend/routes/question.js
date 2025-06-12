import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const rawCategory = req.query.category;
  const categoryId = parseInt(rawCategory?.trim());

  if (isNaN(categoryId)) {
    return res.status(400).json({ error: 'Valid numeric Category ID is required' });
  }

  const query = `
    SELECT id, question, option_a, option_b, option_c, option_d,category_id
    FROM questions
    WHERE category_id = ?
    ORDER BY RAND()
    LIMIT 1
  `;

  try {
    const [results] = await db.execute(query, [categoryId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'No questions found for this category' });
    }

    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
