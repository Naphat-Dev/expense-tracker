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
            type: String,
            required: true
        },

        category: {
            type: String,
            enum: [
                'อาหาร',
                'เดินทาง',
                'ที่พัก',
                'บันเทิง',
                'สุขภาพ',
                'เงินเดือน',
                'อื่นๆ',
            ],
            required: true
        },

        note: {
            type: String,
            default: ''
        },
    },
    { timestamps: true }
)

export default model('Expense', expenseSchema);
