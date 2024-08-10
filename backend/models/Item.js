const { Schema, model } = require('mongoose');

const ItemSchema = new Schema.Schema({
    name: {
        type: String,
        required: true
    },


});


module.exports = model('Item', ItemSchema)

