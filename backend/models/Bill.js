const { Schema, model } = require('mongoose');

const BillSchema = new Schema({
    weight : {
        type: Number,
        required: true
    },

    itemType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },

    vehicle_no : {
        type: String,
        required: true
    },
    
    rate : {
        type: Number,
        required: true
    },

    total : {
        type: Number,
        required: true
    },
    gatePassNo: {
        type: String,
        required: true
    },

    bill_no: {
        type: String,
        required: true
    },
    
    date : {
        type: Date,
        default: Date.now
    },


});


module.exports = model('Bill', BillSchema)