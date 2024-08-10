const Bill = require('../models/Bill');
const Item = require('../models/Item');
const mongoose = require('mongoose');

// Get all bills
async function getAllBills(req, res) {
    try {
        const bills = await Bill.find().populate('itemType');
        res.status(200).json(bills);
    } catch (error) {
        console.error('Error retrieving bills:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Get bill by ID
async function getBillById(req, res) {
    try {
        const billId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(billId)) {
            return res.status(400).json({ message: 'Invalid bill ID.' });
        }

        const bill = await Bill.findById(billId).populate('itemType');
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.status(200).json(bill);
    } catch (error) {
        console.error('Error retrieving bill:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Create a new bill
async function createBill(req, res) {
    try {
        const { weight, itemType, quantity, vehicle_no, rate, total, gatePassNo, bill_no, date } = req.body;

        // Validate required fields
        if (!weight || !itemType || !quantity || !vehicle_no || !rate || !total || !gatePassNo || !bill_no) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        // Validate itemType as a valid ObjectId and check if it exists
        if (!mongoose.Types.ObjectId.isValid(itemType)) {
            return res.status(400).json({ message: 'Invalid item type ID.' });
        }

        const itemExists = await Item.findById(itemType);
        if (!itemExists) {
            return res.status(404).json({ message: 'Item type not found' });
        }

        const bill = new Bill({
            weight,
            itemType,
            quantity,
            vehicle_no,
            rate,
            total,
            gatePassNo,
            bill_no,
            date: date || Date.now()
        });

        const result = await bill.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating bill:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Update a bill by ID
async function updateBill(req, res) {
    try {
        const billId = req.params.id;
        const { weight, itemType, quantity, vehicle_no, rate, total, gatePassNo, bill_no, date } = req.body;

        // Validate bill ID
        if (!mongoose.Types.ObjectId.isValid(billId)) {
            return res.status(400).json({ message: 'Invalid bill ID.' });
        }

        // Validate itemType if provided
        if (itemType && !mongoose.Types.ObjectId.isValid(itemType)) {
            return res.status(400).json({ message: 'Invalid item type ID.' });
        }

        if (itemType) {
            const itemExists = await Item.findById(itemType);
            if (!itemExists) {
                return res.status(404).json({ message: 'Item type not found' });
            }
        }

        const bill = await Bill.findByIdAndUpdate(
            billId,
            { weight, itemType, quantity, vehicle_no, rate, total, gatePassNo, bill_no, date },
            { new: true, runValidators: true }
        );

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        res.status(200).json(bill);
    } catch (error) {
        console.error('Error updating bill:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Delete a bill by ID
async function deleteBill(req, res) {
    try {
        const billId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(billId)) {
            return res.status(400).json({ message: 'Invalid bill ID.' });
        }

        const bill = await Bill.findByIdAndDelete(billId);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error('Error deleting bill:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

module.exports = {
    getAllBills,
    getBillById,
    createBill,
    updateBill,
    deleteBill
};
