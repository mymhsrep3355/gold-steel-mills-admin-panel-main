const { Schema, model } = require('mongoose');

const DaybookSchema = new Schema({

    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        required: false
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    description: {
        type: String,
        required: false,
    },

    amount: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    balance : {
        type: Number,
        required: true
    }



}, { timestamps: true });