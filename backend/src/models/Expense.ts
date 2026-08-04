import { Schema, model } from 'mongoose';

const expenseSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        date: {
            type: Date,
            required: true
        },

        category: {
            type: String,
            enum: [
                'food', 'travel', 'accommodation', 'entertainment', 'health', 'salary', 'other'
            ],
            required: true
        },

        note: {
            type: String,
            default: ''
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

    },
    { timestamps: true }
)

export default model('Expense', expenseSchema);
