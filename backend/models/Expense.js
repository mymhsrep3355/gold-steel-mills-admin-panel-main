const { Schema, model } = require('mongoose');
const ExpenseSchema = new Schema({

    category : {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    amount : {
        type: Number,
        required: true,
        default: 0
    },

    date : {
        type: Date,
        required: true,
        default: Date.now
    },

    description : {
        type: String,
        required: true

    },

});

module.exports = model('Expense', ExpenseSchema)