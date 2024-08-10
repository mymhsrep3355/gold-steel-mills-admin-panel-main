const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    stock : {
        type: Number,
        required: true,
        default: 0
    }

});

module.exports = model('Product', ProductSchema)
