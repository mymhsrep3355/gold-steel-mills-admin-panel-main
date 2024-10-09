const Production = require('../models/Production');
const Product = require('../models/Product');
const Item = require('../models/Item');
const mongoose = require('mongoose');

// Get all productions with optional date filtering
async function getAllProductions(req, res) {
    try {
        const { startDate, endDate } = req.query;

        // Build the query object
        let query = {};

        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                // Set start date to the beginning of the day
                query.date.$gte = new Date(new Date(startDate).setHours(0, 0, 0, 0));
            }
            if (endDate) {
                // Set end date to the end of the day
                query.date.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
            }
        }

        const productions = await Production.find(query).populate('product');
        res.status(200).json(productions);
    } catch (error) {
        console.error('Error retrieving productions:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Get production by ID
async function getProductionById(req, res) {
    try {
        const productionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productionId)) {
            return res.status(400).json({ message: 'Invalid production ID.' });
        }

        const production = await Production.findById(productionId).populate('product');
        if (!production) {
            return res.status(404).json({ message: 'Production not found' });
        }
        res.status(200).json(production);
    } catch (error) {
        console.error('Error retrieving production:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}


// Create a new production
async function createProduction(req, res) {
    try {
        const { product, quantity, waste } = req.body;

        // Validate required fields
        if (!product || quantity === undefined || waste === undefined) {
            return res.status(400).json({ message: 'Product, quantity, and waste are required.' });
        }

        // Validate product
        if (!mongoose.Types.ObjectId.isValid(product)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }

        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const items = await Item.find()
        // Update the item stock
        for (let item of items) {
            item.stock -= (quantity + waste);

            if (item.stock < 0) {
                item.stock = 0
            }

            // if (item.stock < 0) {
            //     return res.status(400).json({ message: 'Insufficient stock', item: item.name, stock: item.stock });
            // }
        }

        
        // console.log(items)

        for (const item of items) {
            await item.save();
        }

        // Create production
        const production = new Production({
            product,
            quantity,
            waste
        });

        const result = await production.save();

        // Update the product stock
        productExists.stock += quantity - waste;
        await productExists.save();

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating production:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Update a production by ID
async function updateProduction(req, res) {
    try {
        const productionId = req.params.id;
        const { product, quantity, waste } = req.body;

        // Validate production ID
        if (!mongoose.Types.ObjectId.isValid(productionId)) {
            return res.status(400).json({ message: 'Invalid production ID.' });
        }

        // Validate product if provided
        if (product && !mongoose.Types.ObjectId.isValid(product)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }

        const production = await Production.findById(productionId);
        
        if (!production) {
            return res.status(404).json({ message: 'Production not found' });
        }

        let previousQuantity = production.quantity;
        let previousWaste = production.waste;

        if (product && product !== production.product.toString()) {
            const newProduct = await Product.findById(product);
            if (!newProduct) {
                return res.status(404).json({ message: 'New product not found' });
            }

            // Update stock of the previous product
            const oldProduct = await Product.findById(production.product);
            oldProduct.stock -= (previousQuantity - previousWaste);
            await oldProduct.save();

            // Set the new product and update its stock
            production.product = product;
            newProduct.stock += (quantity - waste);
            await newProduct.save();
        } else {
            // Update the stock of the same product
            const productToUpdate = await Product.findById(production.product);
            productToUpdate.stock += (quantity - waste) - (previousQuantity - previousWaste);
            await productToUpdate.save();
        }

        production.quantity = quantity;
        production.waste = waste;

        const updatedProduction = await production.save();
        res.status(200).json(updatedProduction);
    } catch (error) {
        console.error('Error updating production:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Delete a production by ID
async function deleteProduction(req, res) {
    try {
        const productionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productionId)) {
            return res.status(400).json({ message: 'Invalid production ID.' });
        }

        const production = await Production.findByIdAndDelete(productionId).populate('product');
        if (!production) {
            return res.status(404).json({ message: 'Production not found' });
        }

        // console.log(production);

        // Update the product stock to remove the effects of the deleted production
        const productToUpdate = production.product;

        if (!productToUpdate) {
            res.status(200).json({ message: 'Production deleted successfully without product' });
            return;
        }
        else {
            productToUpdate.stock -= production.quantity - production.waste;
            if (productToUpdate.stock < 0) {
                productToUpdate.stock = 0;
            }
            await productToUpdate.save();
        }
       

        res.status(200).json({ message: 'Production deleted successfully' });
    } catch (error) {
        console.error('Error deleting production:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

async function updateProductionWaste(req, res) {
    try {
        const { productionId, waste } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productionId)) {
            return res.status(400).json({ message: 'Invalid production ID.' });
        }

        const production = await Production.findById(productionId);
        if (!production) {
            return res.status(404).json({ message: 'Production not found' });
        }

        production.waste = waste;

        const updatedProduction = await production.save();

        res.status(200).json(updatedProduction);

    } catch (error) {
        console.error('Error updating production:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

module.exports = {
    getAllProductions,
    getProductionById,
    createProduction,
    updateProduction,
    deleteProduction,
    updateProductionWaste
};
