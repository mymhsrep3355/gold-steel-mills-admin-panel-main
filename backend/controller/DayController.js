const Daybook = require('../models/Daybook'); 
const Supplier = require('../models/Supplier');
const { applyThirdPayment, applyThirdPaymentToAdvancedFirst } = require('../utils/PaymentUtils');

// Function to record a new daybook entry with optional supplier updates
async function recordDaybookEntry(req, res) {
    console.log('Recording new daybook entry...');
    const { supplierId, date, description, amount, type, cash_or_bank } = req.body;

    try {
        // Create a new daybook entry
        const daybookEntry = new Daybook({
            supplier: supplierId || null,
            date: date || Date.now(),
            description,
            amount,
            type,
            cash_or_bank,
            balance: 0 // Will be recalculated based on the type
        });
        // Fetch the latest balance
        const lastTransaction = await Daybook.findOne().sort({ date: -1, _id: -1 });

        const previousBalance = lastTransaction ? lastTransaction.balance : 0;
        console.log(previousBalance);
        // Calculate the new balance
        const newBalance = type === 'credit' ? previousBalance + amount : previousBalance - amount;
        console.log(newBalance);

        // Update the balance based on the type (credit or debit)
        daybookEntry.balance = newBalance;

        // Save the daybook entry
        const savedDaybookEntry = await daybookEntry.save();
        console.log('Daybook entry recorded successfully.');

        // If a supplier is provided, update their account
        if (supplierId) {
            const supplier = await Supplier.findById(supplierId);
            if (!supplier) {
                console.log('Supplier not found.');
                return res.status(404).json({ message: 'Supplier not found' });
            }

            if (type === 'debit') {
                const { balance, advance } = applyThirdPaymentToAdvancedFirst(
                    supplier.advance || 0,
                    supplier.balance || 0,
                    amount
                );
                supplier.advance = advance;
                supplier.balance = balance;
                supplier.paymentSent += amount;
            } else if (type === 'credit') {
                const { balance, advance } = applyThirdPayment(
                    supplier.balance || 0,
                    supplier.advance || 0,
                    amount
                );
                supplier.balance = balance;
                supplier.advance = advance;
                supplier.paymentReceived += amount;
            }

            const updatedSupplier = await supplier.save();
            console.log('Supplier account updated successfully.');
            res.status(201).json({ daybookEntry: savedDaybookEntry, supplier: updatedSupplier });
        } else {
            res.status(201).json(savedDaybookEntry);
        }
    } catch (err) {
        console.error('Error recording daybook entry:', err.message);
        return res.status(500).json({ message: 'Internal server error: ' + err.message });
    }
}



// Function to get all transactions from the daybook
// Function to get all transactions from the daybook, with optimized date filtering
const getTransactions = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build the date filter query
        let dateFilter = {};

        if (startDate && endDate) {
            // Convert startDate and endDate to Date objects for the full day
            dateFilter.date = {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        } else if (startDate) {
            // Filter for a specific day
            dateFilter.date = {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                $lte: new Date(new Date(startDate).setHours(23, 59, 59, 999))
            };
        } else if (endDate) {
            // Filter for a specific day
            dateFilter.date = {
                $gte: new Date(new Date(endDate).setHours(0, 0, 0, 0)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        }

        // Fetch transactions with the date filter if provided
        const transactions = await Daybook.find(dateFilter).sort({ date: 1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Function to get a specific transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Daybook.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to delete a transaction by ID
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Daybook.findByIdAndDelete(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to update a transaction by ID
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, amount, type, cash_or_bank } = req.body;

        // Fetch the transaction to update
        let transaction = await Daybook.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update the transaction details
        transaction.description = description || transaction.description;
        transaction.amount = amount || transaction.amount;
        transaction.type = type || transaction.type;
        transaction.cash_or_bank = cash_or_bank || transaction.cash_or_bank;

        // Recalculate the balance based on the updated transaction
        const previousTransactions = await Daybook.find({ date: { $lt: transaction.date } }).sort({ date: -1 });
        const previousBalance = previousTransactions.length > 0 ? previousTransactions[0].balance : 0;
        transaction.balance = type === 'credit' ? previousBalance + transaction.amount : previousBalance - transaction.amount;

        // Save the updated transaction
        await transaction.save();

        // Update balances of subsequent transactions
        const subsequentTransactions = await Daybook.find({ date: { $gt: transaction.date } }).sort({ date: 1 });
        subsequentTransactions.reduce((currentBalance, nextTransaction) => {
            nextTransaction.balance = nextTransaction.type === 'credit' ? currentBalance + nextTransaction.amount : currentBalance - nextTransaction.amount;
            nextTransaction.save();
            return nextTransaction.balance;
        }, transaction.balance);

        res.status(200).json({
            message: 'Transaction updated successfully',
            transaction
        });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    recordDaybookEntry,
    getTransactions,
    getTransactionById,
    deleteTransaction,
    updateTransaction
};
