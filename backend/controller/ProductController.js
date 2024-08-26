const Product = require('../models/Product');
const Production = require('../models/Production');
const mongoose = require('mongoose');

// Get all products
async function getAllProducts(req, res) {
    try {
        
        const products = await Product.find();
        const productsWithWaste = [];
        for (const product of products) {
            
            let waste = 0.0;
            const productions = await Production.find({ product: product }).exec();
            for (const production of productions) {
                waste += production.waste;
            }
            
            productsWithWaste.push({ ...product._doc, waste });
            
        }
        res.status(200).json(productsWithWaste);
    } catch (error) {
        console.error('Error retrieving products:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Get product by ID
async function getProductById(req, res) {
    try {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error retrieving product:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Create a new product
async function createProduct(req, res) {
    try {
        const { name, stock } = req.body;

        // Validate required fields
        if (!name || stock === undefined) {
            return res.status(400).json({ message: 'Name and stock are required.' });
        }

        // Create product
        const product = new Product({
            name,
            stock
        });

        const result = await product.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Update a product by ID
async function updateProduct(req, res) {
    try {
        const productId = req.params.id;
        const { name, stock } = req.body;

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }

        // Validate input data
        if (name === undefined && stock === undefined) {
            return res.status(400).json({ message: 'At least one of name or stock must be provided.' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields
        if (name !== undefined) product.name = name;
        if (stock !== undefined) product.stock = stock;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

// Delete a product by ID
async function deleteProduct(req, res) {
    try {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }

        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
