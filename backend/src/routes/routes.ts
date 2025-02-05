// routes.ts
import { Router } from 'express';
import db from '../config/db';

const router = Router();

// Sample API route
router.get('/api/metrics', async (req, res) => {
  try {
    const metrics = await db.query('SELECT * FROM metrics');
    res.json(metrics.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
