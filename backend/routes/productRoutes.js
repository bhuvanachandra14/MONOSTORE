const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all products
router.get('/', async (req, res) => {
    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    try {
        const products = await Product.find({ ...keyword });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE Product (Admin only)
router.post('/', protect, admin, async (req, res) => {
    const { title, price, description, category, image } = req.body;
    try {
        const product = new Product({
            title,
            price,
            description,
            category,
            image,
            rating: { rate: 0, count: 0 }
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
