import Expense from '../models/Expense';
import { Request, Response } from 'express';

export const getExpenses = async (req: Request, res: Response) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve expenses" });
    }
};


export const createExpense = async (req: Request, res: Response) => {
    try {
        console.log(req.body);

        const expense = await Expense.create(req.body);

        res.status(201).json(expense);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Failed to create expense",
        });
    }
};

export const updateExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                message: "Expense not found",
            });
        }

        res.status(200).json(updatedExpense);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update expense",
        });
    }
};

export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedExpense = await Expense.findByIdAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found",
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete expense",
        });
    }
};
