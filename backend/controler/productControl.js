import Product from "../models/product.js";

const addProduct = async(req, res) => {
    const { category, title, price, image,quantity } = req.body;
    try {
        let newProduct = new Product({ category, title, price, image ,  quantity});
        await newProduct.save();
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addManyProduct = async(req, res) => {
    const products = req.body;
    try {
        await Product.insertMany(products);
        res.status(201).json({ message: "Products created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const listProduct = async(req, res) => {
    try {
        const product = await Product.find();
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const removeProduct = async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateProduct = async(req, res) => {
    const { id } = req.params;
    const { category, title, price, image , quantity} = req.body;
    try {
        const product = await Product.findByIdAndUpdate(id, { category, title, price, image,quantity });
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const orderPlace = async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, { customersID: { $addToSet: req.user._id } });
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { addProduct, listProduct, removeProduct , updateProduct,addManyProduct};  