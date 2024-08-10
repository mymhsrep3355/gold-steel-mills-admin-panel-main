const { model, Schema } = require('mongoose');



const purchaseSchema = new Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
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
}, {
    timestamps: true,
})


module.exports = model('Purchase', purchaseSchema)
