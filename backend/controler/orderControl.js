import Order from '../models/order.js';
import Product from '../models/product.js';
import dotenv from 'dotenv';
dotenv.config();


const orderControl = async (req, res)=>{
        const { id } = req.params;
        try {
            // const product = await Product.findById(id);
            // if (!product) {
            //     return res.status(404).json({ error: "Product not found" });
            // }
            // const order = new Order({
            //     products: [{ product: product._id, quantity: 1 }],
            //     totalAmount: product.price,
            //     paymentMethod: product.paymentMethod,
            //     user: req.user._id,
            // });
            const order = new Order({...req.body})
            await order.save();
            res.status(201).json({ message: "Order created successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

export default orderControl
