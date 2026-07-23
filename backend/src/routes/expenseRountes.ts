import express from 'express';
import { getExpenses } from '../controllers/expenseController';

const router = express.Router();
router.get('/', getExpenses);

export default router;

