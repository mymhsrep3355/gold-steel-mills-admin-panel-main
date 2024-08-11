const mongoose = require('mongoose');
const Supplier = require('../models/Supplier');

const { applyThirdPayment, applyThirdPaymentToAdvancedFirst } = require('../utils/PaymentUtils');

async function getAllSuppliers(req, res) {
    try {
        console.log('Getting all suppliers...');
        const suppliers = await Supplier.find();
        console.log('Suppliers retrieved successfully.');
        res.send(suppliers);
    } catch (err) {
        console.error('Error getting suppliers:', err.message);
        return res.status(500).json({ message: 'Internal server error: ' + err.message });
    }
}

async function getSupplierById(req, res) {
    try {
        console.log('Getting supplier by ID...');
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            console.log('Supplier not found.');
            return res.status(404).json({ message: 'Supplier not found' });
        }
        console.log('Supplier retrieved successfully.');
        res.send(supplier);
    } catch (err) {
        console.error('Error getting supplier by ID:', err.message);
        return res.status(500).json({ message: 'Internal server error: ' + err.message });
    }
}

async function createSupplier(req, res) {
    console.log('Creating new supplier...');
    const { firstName, lastName, contactNumber, email } = req.body;

    if (!firstName || !lastName || !contactNumber) {
        console.log('Missing required fields.');
        return res.status(400).json({ message: 'First name, last name, and contact number are required.' });
    }

    try {
        const existingSupplier = await Supplier.findOne({ contactNumber });
        if (existingSupplier) {
            console.log('Supplier with this contact number already exists.');
            return res.status(409).json({ message: 'A supplier with this contact number already exists.' });
        }

        const supplier = new Supplier({
            firstName,
            lastName,
            contactNumber,
            email,
            paymentReceived: req.body.paymentReceived || 0,
            paymentSent: req.body.paymentSent || 0,
            advance: req.body.advance || 0,
            balance: req.body.balance || 0
        });

        const result = await supplier.save();
        console.log('Supplier created successfully.');
        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating supplier:', err.message);
        return res.status(500).json({ message: 'Internal server error: ' + err.message });
    }
}

async function updateSupplier(req, res) {
    console.log('Updating supplier...');
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!supplier) {
            console.log('Supplier not found.');
            return res.status(404).json({ message: 'Supplier not found' });
        }
        console.log('Supplier updated successfully.');
        res.send(supplier);
    } catch (err) {
        console.error('Error updating supplier:', err.message);
        return res.status(500).json({ message: 'Internal server error: ' + err.message });
    }
}

async function deleteSupplier(req, res) {
    console.log('Deleting supplier...');
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) {
            console.log('Supplier not found.');
            return res.status(404).json({ message: 'Supplier not found' });
        }
        console.log('Supplier deleted successfully.');
        res.send(supplier);
    } catch (err) {
        console.error('Error deleting supplier:', err.message);
        return res.status(500).json({ message: 'Internal server error: ' + err.message });
    }
}

// function applyThirdPayment(balance, advance, thirdPayment) {
//     console.log('Applying third payment...');
//     if (thirdPayment >= balance) {
//         thirdPayment -= balance;
//         balance = 0;
//     } else {
//         balance -= thirdPayment;
//         thirdPayment = 0;
//     }

//     advance += thirdPayment;
//     console.log('Third payment applied successfully.');
//     return { balance, advance };
// }

async function paymentReceived(req, res) {
    console.log('Processing payment received...');
    if (!req.body || !req.body.id || !req.body.paymentReceived) {
        console.log('Missing required fields.');
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const supplier = await Supplier.findById(req.body.id);
        if (!supplier) {
            console.log('Supplier not found.');
            return res.status(404).json({ message: 'Supplier not found' });
        }

        const { balance, advance } = applyThirdPayment(
            supplier.balance || 0,
            supplier.advance || 0,
            req.body.paymentReceived
        );

        supplier.balance = balance;
        supplier.advance = advance;
        supplier.paymentReceived += req.body.paymentReceived;
        const result = await supplier.save();

        console.log('Payment received processed successfully.');
        res.send(result);
    } catch (err) {
        console.error('Error processing payment received:', err.message);
        return res.status(500).json({ message: 'Internal server error: ' + err.message });
    }
}

// function applyThirdPaymentToAdvancedFirst(advance, balance, thirdPayment) {
//     console.log('Applying third payment to advance first...');
//     if (thirdPayment >= advance) {
//         thirdPayment -= advance;
//         advance = 0;
//     } else {
//         advance -= thirdPayment;
//         thirdPayment = 0;
//     }

//     balance += thirdPayment;
//     console.log('Third payment applied to advance first successfully.');
//     return { advance, balance };
// }

async function paymentSent(req, res) {
    console.log('Processing payment sent...');
    if (!req.body || !req.body.id || !req.body.paymentSent) {
        console.log('Missing required fields.');
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const supplier = await Supplier.findById(req.body.id);
        if (!supplier) {
            console.log('Supplier not found.');
            return res.status(404).json({ message: 'Supplier not found' });
        }

        const { advance, balance } = applyThirdPaymentToAdvancedFirst(
            supplier.advance || 0,
            supplier.balance || 0,
            req.body.paymentSent
        );

        supplier.balance = balance;
        supplier.advance = advance;
        supplier.paymentSent += req.body.paymentSent;
        const result = await supplier.save();

        console.log('Payment sent processed successfully.');
        res.send(result);
    } catch (err) {
        console.error('Error processing payment sent:', err.message);
        return res.status(500).json({ message: 'Internal server error: ' + err.message });
    }
}

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    paymentReceived,
    paymentSent
};
