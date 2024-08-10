const { Schema, model } = require('mongoose');

const ProductionSchema = new Schema({

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
    
    