import express from 'express';
import { getAllExpenses } from '../controllers/expenseController';
import { getExpenseById } from '../controllers/expenseController';
import { createExpense } from '../controllers/expenseController';
import { updateExpense } from '../controllers/expenseController';
import { deleteExpense } from '../controllers/expenseController';
import { getSummary } from '../controllers/expenseController';
import { getExpensesByFilter } from '../controllers/expenseController';

const router = express.Router();
router.get('/', getAllExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.get('/summary', getSummary);
router.get('/filter', getExpensesByFilter);
// GET      /dashboard       Dashboard
// GET      /report          รายงานรายเดือน




export default router;

