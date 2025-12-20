const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order Key (Step 1)
router.post('/razorpay', protect, async (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new order (Step 2 - After Payment)
router.post('/', protect, async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        // Verify Payment Signature if Payment Method is Card/Razorpay
        let isPaid = false;
        let paidAt = null;
        let paymentResult = {};

        if (paymentMethod === 'Card' && req.body.paymentResult) {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.paymentResult;

            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature === razorpay_signature) {
                isPaid = true;
                paidAt = Date.now();
                paymentResult = {
                    id: razorpay_payment_id,
                    status: 'success',
                    update_time: Date.now(),
                    email_address: req.user.email,
                };
            } else {
                res.status(400).json({ message: 'Payment verification failed' });
                return;
            }
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            isPaid,
            paidAt,
            paymentResult
        });

        try {
            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
});

// Get logged in user orders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
