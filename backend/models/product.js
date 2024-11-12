import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number'],  
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity must be a positive number'], 
    },
    description: {
        type: String,
        required: [true, 'Quantity is required'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        validate: {
            validator: function(value) {
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            return urlRegex.test(value);  // Checks if the image URL is valid
            },
            message: 'Invalid image URL format',
        },
    },
    customersID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });  // Adds createdAt and updatedAt fields

const Product = mongoose.model('Product', productSchema);

 export default Product;