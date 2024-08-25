const { Schema, model } = require('mongoose');


const SalesSchema = new Schema({
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        required: false,
    },

    customer_name :{
        type: String, 
        required: false,
    },

    bills:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'Bill',
                required: true
            }
        ]
    ,
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    totalAmount: {
        type: Number,
        required: true
    },


});


module.exports = model('Sales', SalesSchema)

