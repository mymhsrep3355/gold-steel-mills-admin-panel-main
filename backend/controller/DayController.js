const Daybook = require('../models/Daybook'); 
const Supplier = require('../models/Supplier');
const Purchase = require('../models/Purchase');
const Sales = require('../models/Sales');
const ItemType = require('../models/Item');
const { applyThirdPayment, applyThirdPaymentToAdvancedFirst } = require('../utils/PaymentUtils');

// Function to record a new daybook entry with optional supplier updates
async function recordDaybookEntry(req, res) {
    console.log('Recording new daybook entry...');
    const { supplierId, customerName, date, description, amount, type, cash_or_bank } = req.body;
    console.log(req.body)
    try {
        // Create a new daybook entry
        const daybookEntry = new Daybook({
            supplier: supplierId || null,
            customerName: customerName || null,
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
        console.log(daybookEntry);
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
// const getTransactions = async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;

//         // Build the date filter query
//         let dateFilter = {};

//         if (startDate && endDate) {
//             // Convert startDate and endDate to Date objects for the full day
//             dateFilter.date = {
//                 $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
//                 $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
//             };
//         } else if (startDate) {
//             // Filter for a specific day
//             dateFilter.date = {
//                 $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
//                 $lte: new Date(new Date(startDate).setHours(23, 59, 59, 999))
//             };
//         } else if (endDate) {
//             // Filter for a specific day
//             dateFilter.date = {
//                 $gte: new Date(new Date(endDate).setHours(0, 0, 0, 0)),
//                 $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
//             };
//         }

//         // Fetch transactions with the date filter if provided
//         const transactions = await Daybook.find(dateFilter).populate('supplier').sort({ date: 1 })

//         // Add the opening balance as the first entry if there are any transactions
//         if (transactions.length > 0) {
//             transactions.unshift({
//                 date: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
//                 description: "Opening Balance",
//                 debit: 0,
//                 credit: 0,
//                 balance: openingBalance,
//             });
//         }

//         res.status(200).json({ transactions, openingBalance });

        
//         // res.status(200).json(transactions);
//     } catch (error) {
//         console.error('Error fetching transactions:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


const getTransactions = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build the date filter query
        let dateFilter = {};

        if (startDate && endDate) {
            // Convert startDate and endDate to Date objects for the full day
            dateFilter.date = {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            };
        } else if (startDate) {
            // Filter for a specific day
            dateFilter.date = {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                $lte: new Date(new Date(startDate).setHours(23, 59, 59, 999)),
            };
        } else if (endDate) {
            // Filter for a specific day
            dateFilter.date = {
                $gte: new Date(new Date(endDate).setHours(0, 0, 0, 0)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            };
        }

        // Fetch the last transaction before the startDate to calculate the opening balance
        let openingBalance = 0;
        if (startDate) {
            const getPreviousDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
            getPreviousDate.setDate(getPreviousDate.getDate() - 1);
            const lastDateFilter = {
                date: {
                    $gte: new Date(getPreviousDate).setHours(0, 0, 0, 0),
                    $lte: new Date(new Date(startDate).setHours(23, 59, 59, 999)),
                },
            }

            // const lastDayTransactions = await Daybook.find(lastDateFilter).sort({ date: -1 });
            // if (lastDayTransactions.length > 0) {
            //     for (const transaction of lastDayTransactions) {
            //         if (transaction.type === "credit") {
            //             openingBalance += transaction.amount;
            //         } else {
            //             openingBalance -= transaction.amount;
            //         }
            //     }
            // }



        }

        // Fetch the transactions within the date range
        const transactions = await Daybook.find(dateFilter).populate("supplier").sort({ date: 1 })
        // openingBalance = transactions[transactions.length - 1].balance;
        // console.log("openingBalance:", openingBalance);

        // console.log("Transactions:", transactions);
        
        res.status(200).json(transactions);
        // res.status(200).json({ transactions, openingBalance });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const getBalance = async (req, res) => {
    try {
        const lastTransaction = await Daybook.findOne().sort({ date: -1, _id: -1 });
        const balance = lastTransaction ? lastTransaction.balance : 0;
        res.status(200).json({ balance });
    } catch (error) {
        console.error('Error fetching balance:', error);
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


// Function to generate financial reports (Revenues, Expenses, Profit & Loss)
const generateReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build the date filter query
        let dateFilter = {};

        if (startDate && endDate) {
            dateFilter.date = {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        } else if (startDate) {
            dateFilter.date = {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                $lte: new Date(new Date(startDate).setHours(23, 59, 59, 999))
            };
        } else if (endDate) {
            dateFilter.date = {
                $gte: new Date(new Date(endDate).setHours(0, 0, 0, 0)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        }

        // Fetch transactions with the date filter if provided
        const transactions = await Daybook.find(dateFilter).sort({ date: 1 });

        // Initialize aggregates
        let totalRevenuesBank = 0;
        let totalExpensesBank = 0;
        let totalRevenuesCash = 0;
        let totalExpensesCash = 0;

        // Calculate totals based on type and payment method
        transactions.forEach(transaction => {
            if (transaction.type === 'credit') {
                if (transaction.cash_or_bank === 'bank') {
                    totalRevenuesBank += transaction.amount;
                } else if (transaction.cash_or_bank === 'cash') {
                    totalRevenuesCash += transaction.amount;
                }
            } else if (transaction.type === 'debit') {
                if (transaction.cash_or_bank === 'bank') {
                    totalExpensesBank += transaction.amount;
                } else if (transaction.cash_or_bank === 'cash') {
                    totalExpensesCash += transaction.amount;
                }
            }
        });

        // Calculate net profit/loss for both bank and cash
        const netProfitLossBank = totalRevenuesBank - totalExpensesBank;
        const netProfitLossCash = totalRevenuesCash - totalExpensesCash;
        const netProfitLoss = netProfitLossBank + netProfitLossCash;

        res.status(200).json({
            totalRevenuesBank,
            totalExpensesBank,
            netProfitLossBank,
            totalRevenuesCash,
            totalExpensesCash,
            netProfitLossCash,
            netProfitLoss,
            transactions
        });
    } catch (error) {
        console.error('Error generating reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getSupplierTransactions = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;

        // Build the date filter only if startDate or endDate is present
        const dateFilter = {};
        if (startDate) {
            dateFilter.$gte = new Date(new Date(startDate).setHours(0, 0, 0, 0));
        }
        if (endDate) {
            dateFilter.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
        }

        const supplier = await Supplier.findById(id).exec();

        // Apply date filter to the transactions query only if dateFilter is not empty
        const transactionsQuery = { supplier: id };
        if (Object.keys(dateFilter).length > 0) {
            transactionsQuery.date = dateFilter;
        }

        const transactions = await Daybook.find(transactionsQuery).sort({ date: 1 });

        // Apply date filter to the purchases query
        const purchasesQuery = { supplier: id };
        if (Object.keys(dateFilter).length > 0) {
            purchasesQuery.date = dateFilter;
        }

        const purchases = await Purchase.find(purchasesQuery).populate('bills');

        // Apply date filter to the sales query
        const salesQuery = { supplier: id };
        if (Object.keys(dateFilter).length > 0) {
            salesQuery.date = dateFilter;
        }

        const sales = await Sales.find(salesQuery).populate('bills');

        let debit = 0;
        let credit = 0;

        let combinedTransactions = [];
        for (let transaction of transactions) {
            if (transaction.type === 'debit') {
                combinedTransactions.push({
                    date: transaction.date,
                    description: transaction.description ? transaction.description : 'N/A',
                    debit: transaction.amount,
                    credit: 0,
                });
                debit += transaction.amount;
            } else if (transaction.type === 'credit') {
                combinedTransactions.push({
                    date: transaction.date,
                    description: transaction.description ? transaction.description : 'N/A',
                    debit: 0,
                    credit: transaction.amount,
                });
                credit += transaction.amount;
            }
        }

        for (let purchase of purchases) {
            for (let bill of purchase.bills) {
                let itemType = await ItemType.findOne({ _id: bill.itemType });
                if (!itemType) {
                    itemType = {};
                    itemType['name'] = '';
                }

                if (bill.kaat === undefined) {
                    bill['kaat'] = 0;
                }

                if (bill.weight === undefined) {
                    bill['weight'] = 0;
                }

                combinedTransactions.push({
                    date: bill.date,
                    description: `Type: ${itemType.name} || Weight: ${bill.weight} Kaat: ${bill.kaat}`,
                    debit: 0,
                    credit: bill.rate * bill.quantity,
                });
                credit += bill.rate * bill.quantity;
            }
        }

        for (let sale of sales) {
            for (let bill of sale.bills) {
                let itemType = await ItemType.findOne({ _id: bill.itemType });
                if (!itemType) {
                    itemType = {};
                    itemType['name'] = '';
                }

                if (bill.kaat === undefined) {
                    bill['kaat'] = 0;
                }

                if (bill.weight === undefined) {
                    bill['weight'] = 0;
                }

                combinedTransactions.push({
                    date: bill.date,
                    description: `Type: ${itemType?.name} || Weight: ${bill.weight}`,
                    debit: bill.rate * bill.quantity,
                    credit: 0,
                });
                debit += bill.rate * bill.quantity;
            }
        }

        // Sort the combined transactions by date
        combinedTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.status(200).json({
            combinedTransactions,
            totalDebit: debit,
            totalCredit: credit,
            supplier: supplier,
        });
    } catch (error) {
        console.error('Error fetching supplier transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const getPurchasesSalesAverageRate = async (req, res) => {
    try {
        // Fetch purchases and sales with populated bills
        const purchases = await Purchase.find().populate('bills');
        const sales = await Sales.find().populate('bills');
        
        let totalPurchaseRate = 0;
        let purchaseCount = 0;

        // Calculate average purchase rate
        for (let purchase of purchases) {
            if (purchase.bills.length > 0) {
                let billRateSum = purchase.bills.reduce((billTotal, bill) => billTotal + bill.rate, 0);
                totalPurchaseRate += billRateSum / purchase.bills.length; // Average rate per purchase
                purchaseCount++;
            }
        }

        let averagePurchaseRate = purchaseCount > 0 ? totalPurchaseRate / purchaseCount : 0;
        
        let totalSalesRate = 0;
        let salesCount = 0;

        // Calculate average sales rate
        for (let sale of sales) {
            if (sale.bills.length > 0) {
                let billRateSum = sale.bills.reduce((billTotal, bill) => billTotal + bill.rate, 0);
                totalSalesRate += billRateSum / sale.bills.length; // Average rate per sale
                salesCount++;
            }
        }

        let averageSalesRate = salesCount > 0 ? totalSalesRate / salesCount : 0;
        
        // Calculate the difference between average purchase rate and average sales rate
        let rateDifference = averageSalesRate - averagePurchaseRate;

        // Return the results
        res.status(200).json({
            averagePurchaseRate: averagePurchaseRate.toFixed(2),
            averageSalesRate: averageSalesRate.toFixed(2),
            rateDifference: rateDifference.toFixed(2),
        });
    } catch (error) {
        console.error('Error calculating rates:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};




module.exports = {
    recordDaybookEntry,
    getTransactions,
    getTransactionById,
    deleteTransaction,
    updateTransaction,
    generateReports,
    getSupplierTransactions,
    getPurchasesSalesAverageRate,
    getBalance,
};
