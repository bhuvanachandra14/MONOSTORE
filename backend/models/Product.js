const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL to image
        required: true,
    },
    rating: {
        rate: Number,
        count: Number,
    }
});

module.exports = mongoose.model('Product', productSchema);
