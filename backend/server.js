import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/question.js';
import attemptRoutes from './routes/attempt.js';
import statsRoute from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    const [rows] = await db.execute('SELECT 1');
    console.log('✅ MySQL connection test successful');
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();

app.use('/question', questionRoutes);
app.use('/auth', authRoutes);
app.use('/attempt',attemptRoutes);
app.use('/stats', statsRoute);

app.get('/', (req, res) => {
  res.status(200).send('✅ Server is up and running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
