require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    {
        title: "Minimalist Wireless Headphones",
        price: 199.99,
        description: "High-fidelity audio with active noise cancellation. Sleek matte black finish.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
        rating: { rate: 4.5, count: 120 }
    },
    {
        title: "Ergonomic Office Chair",
        price: 249.99,
        description: "All-day comfort with lumbar support and breathable mesh.",
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
        rating: { rate: 4.2, count: 50 }
    },
    {
        title: "Mechanical Keyboard",
        price: 89.99,
        description: "Compact mechanical keyboard with tactile switches and white backlight.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop",
        rating: { rate: 4.8, count: 300 }
    },
    {
        title: "Ceramic Coffee Mug",
        price: 15.00,
        description: "Handcrafted ceramic mug, perfect for your daily brew.",
        category: "Kitchen",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop",
        rating: { rate: 4.0, count: 85 }
    },
    {
        title: "Smart Watch Series 5",
        price: 299.00,
        description: "Track your fitness and stay connected with this premium smartwatch.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop",
        rating: { rate: 4.6, count: 150 }
    },
    {
        title: "Leather Wallet",
        price: 45.00,
        description: "Genuine leather bifold wallet with RFID protection.",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop",
        rating: { rate: 4.3, count: 200 }
    },
    {
        title: "Matte Black Tumbler",
        price: 25.99,
        description: "Double-walled vacuum insulated tumbler to keep drinks hot or cold.",
        category: "Kitchen",
        image: "https://placehold.co/600x600/111111/ffffff?text=Black+Tumbler",
        rating: { rate: 4.7, count: 450 }
    },
    {
        title: "Minimalist Desk Lamp",
        price: 59.99,
        description: "Adjustable LED desk lamp with touch control and dimmable brightness.",
        category: "Furniture",
        image: "https://placehold.co/600x600/eeeeee/111111?text=Desk+Lamp",
        rating: { rate: 4.4, count: 80 }
    },
    {
        title: "Classic White Sneakers",
        price: 89.00,
        description: "Timeless white sneakers made from premium vegan leather.",
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
        rating: { rate: 4.1, count: 125 }
    },
    {
        title: "Black Graphic Tee",
        price: 29.99,
        description: "100% cotton t-shirt with a subtle geometric design.",
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
        rating: { rate: 4.3, count: 60 }
    },
    {
        title: "Noise Cancelling Earbuds",
        price: 149.99,
        description: "Compact wireless earbuds with deep bass and crystal clear calls.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop",
        rating: { rate: 4.6, count: 310 }
    },
    {
        title: "Hardcover Notebook",
        price: 18.50,
        description: "Premium paper notebook with a soft-touch matte black cover.",
        category: "Stationery",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
        rating: { rate: 4.9, count: 500 }
    }
];

const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_clone';

mongoose.connect(dbUri)
    .then(async () => {
        console.log('MongoDB connected for seeding');
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Data seeded successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
