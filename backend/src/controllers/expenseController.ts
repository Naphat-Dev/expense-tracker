import Expense from '../models/Expense';
import { Request, Response } from 'express';

export const getExpenses = async (req: Request, res: Response) => {
    const expenses = await Expense.find();
    res.json(expenses); 
};

// export const createExpense = async (req: Request, res: Response) => {
//     const expense = await Expense.create(req.body);

//     res.status(201).json(expense);
// };
