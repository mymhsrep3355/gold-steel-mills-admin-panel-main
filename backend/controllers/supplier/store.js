const { supplier } = require("../../models/suppliers");
const { Database } = require("../../database/Database");
const { Validator } = require("../../utils/Validator");
const { Constants } = require("../../constants/Constants");

const supplierStore = async (req, res) => {
    try {
        const { firstName, lastName, contactNumber } = req.body;

        // Validate first and last names
        if (!(Validator.string(firstName, Constants.MIN_FIRSTNAME_LENGTH, Constants.MAX_FIRSTNAME_LENGTH) && Validator.string(lastName, Constants.MIN_LASTNAME_LENGTH, Constants.MAX_LASTNAME_LENGTH))) {
            return res.status(400).json({ error: 'Provide first and last name of minimum 3 and maximum 15 characters.' });
        }

        // Validate contact number length
        if (!Validator.string(contactNumber, 11, 11)) {
            return res.status(400).json({ error: 'Provide phone number of exactly 11 digits.' });
        }

        // Check if supplier already exists
        const alreadyExists = await supplier.findOne({
            where: {
                contactNumber: contactNumber,
            },
        });

        if (alreadyExists) {
            return res.status(409).json({ error: 'Supplier with this phone number already exists.' });
        }

        // Adding data to database
        const newSupplier = await supplier.create({ firstName, lastName, contactNumber });
        return res.status(201).json({ message: 'Supplier created successfully.', supplier: newSupplier });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Server error.' });
    }
};

module.exports = { supplierStore };
