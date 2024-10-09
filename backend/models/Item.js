const { Schema, model } = require('mongoose');

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: props => `${props.value} is not a positive number`
        },
        

    }


});


module.exports = model('Item', ItemSchema)

