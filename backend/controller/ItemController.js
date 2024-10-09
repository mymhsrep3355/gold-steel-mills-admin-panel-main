const Item = require('../models/Item');
const mongoose = require('mongoose');

// Get all items
async function getAllItems(req, res) {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error retrieving items:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Get item by ID
async function getItemById(req, res) {
    try {
        const itemId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: 'Invalid item ID.' });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error('Error retrieving item:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Create a new item
async function createItem(req, res) {
    try {
        const { name, stock } = req.body;

        // Validate required fields
        if (!name || stock === undefined) {
            return res.status(400).json({ message: 'Name and stock are required.' });
        }

        // Validate that stock is a non-negative number
        if (stock < 0) {
            return res.status(400).json({ message: 'Stock must be a non-negative number.' });
        }

        const item = new Item({ name, stock });
        const result = await item.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating item:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Update an item by ID
async function updateItem(req, res) {
    try {
        const itemId = req.params.id;
        const { name, stock } = req.body;

        // Validate item ID
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: 'Invalid item ID.' });
        }

        // Validate stock if provided
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({ message: 'Stock must be a non-negative number.' });
        }

        const item = await Item.findByIdAndUpdate(
            itemId,
            { name, stock },
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error('Error updating item:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Delete an item by ID
async function deleteItem(req, res) {
    try {
        const itemId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: 'Invalid item ID.' });
        }

        const item = await Item.findByIdAndDelete(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};
