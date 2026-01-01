const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                addresses: user.addresses,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add new address
// @route   POST /api/users/address
// @access  Private

router.post('/address', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const { address, city, postalCode, country } = req.body;
            const newAddress = { address, city, postalCode, country };
            user.addresses.push(newAddress);
            const updatedUser = await user.save();
            res.json(updatedUser.addresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete address
// @route   DELETE /api/users/address/:id
// @access  Private
router.delete('/address/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.addresses = user.addresses.filter(
                (addr) => addr._id.toString() !== req.params.id
            );
            const updatedUser = await user.save();
            res.json(updatedUser.addresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
