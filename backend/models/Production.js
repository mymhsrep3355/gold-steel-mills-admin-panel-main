const { Schema, model } = require('mongoose');

const ProductionSchema = new Schema({
    product : {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    quantity: {
        type: Number,
        required: true
    },

    waste: {
        type: Number,
        required: true
    },


}, { timestamps: true });

module.exports = model('Production', ProductionSchema);
    
    