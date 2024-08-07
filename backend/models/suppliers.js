const {  DataTypes } = require('sequelize');
const {Database}=require('../database/Database')

const supplier = Database.sequelize.define(
    'supplier',
    {
        // Model attributes are defined here

        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactNumber:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },
    {
        // freezeTableName:true
    },
);



// `sequelize.define` also returns the model
module.exports={supplier}