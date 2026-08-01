import Expense from '../models/Expense';
import { Request, Response } from 'express';
import { getTimeRangeBounds } from '../utils/date';

export const getAllExpenses = async (req: Request, res: Response) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve expenses" });
    }
};

export const getExpenseById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findById(id);
        res.json(expense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve expense" });
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

export const deleteAllExpenses = async (req: Request, res: Response) => {
    try {
        await Expense.deleteMany();
        res.status(200).json({ message: "All expenses deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete all expenses" });
    }
};

export const getSummary = async (req: Request, res: Response) => {
    try {
        const expenses = await Expense.find();

        const income = expenses
            .filter(expense => expense.type === "income")
            .reduce((total, expense) => total + expense.amount, 0);

        const expense = expenses
            .filter(expense => expense.type === "expense")
            .reduce((total, expense) => total + expense.amount, 0);

        res.status(200).json({
            income,
            expense,
            balance: income - expense,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get summary",
        });
    }
};


export const getExpensesByFilter = async (req: Request, res: Response) => {
    try {
        const {
            search,
            type,
            category,
            timeRange,
            sort,
        } = req.query;

        const filter: any = {};

        if (type && type !== "all") {
            filter.type = type;
        }

        if (category && category !== "all") {
            filter.category = category;
        }


        if (search) {
            filter.$or = [
                {
                    note: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    category: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }


        if (timeRange && timeRange !== "all") {
            const { startDate, endDate } = getTimeRangeBounds(String(timeRange));
            filter.date = { $gte: startDate, $lt: endDate };
        }

        // Query
        let query = Expense.find(filter);

        // Sort
        switch (sort) {

            case "date-asc":
                query = query.sort({ date: 1, _id: 1 })
                break

            case "amount-desc":
                query = query.sort({ amount: -1, _id: -1 })
                break

            case "amount-asc":
                query = query.sort({ amount: 1, _id: 1 })
                break

            case "date-desc":
            default:
                query = query.sort({ date: -1, _id: -1 })
        }

        const expenses = await query;

        res.status(200).json(expenses);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve expenses",
        });
    }
};