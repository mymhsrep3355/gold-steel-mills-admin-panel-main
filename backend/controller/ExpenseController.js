const Expense = require('../models/Expense');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Get all expenses
async function getAllExpenses(req, res) {
    try {
        const expenses = await Expense.find().populate('category');
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error getting expenses:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Get expense by ID
async function getExpenseById(req, res) {
    try {
        const expense = await Expense.findById(req.params.id).populate('category');
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        console.error('Error getting expense:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Create a new expense
async function createExpense(req, res) {
    const { category, amount, date, description } = req.body;

    // Check if required fields are present
    if (!category || !amount || !description) {
        return res.status(400).json({ message: 'Category, amount, and description are required.' });
    }

    // Check if category is a valid ObjectId and exists in the database
    if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: 'Invalid category ID.' });
    }

    try {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const expense = new Expense({
            category,
            amount,
            date: date || Date.now(),
            description
        });

        const result = await expense.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating expense:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Update an expense by ID
async function updateExpense(req, res) {
    const { category, amount, date, description } = req.body;

    // Validate category if provided
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: 'Invalid category ID.' });
    }

    try {
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ message: 'Category not found' });
            }
        }

        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { category, amount, date, description },
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json(expense);
    } catch (error) {
        console.error('Error updating expense:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Delete an expense by ID
async function deleteExpense(req, res) {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

module.exports = {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
};
