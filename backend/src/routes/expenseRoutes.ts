import express from 'express';
import { createExpense } from '../controllers/expenseController';
import { getExpenses } from '../controllers/expenseController';
import { updateExpense } from '../controllers/expenseController';
import { deleteExpense } from '../controllers/expenseController';

const router = express.Router();
router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);


export default router;

