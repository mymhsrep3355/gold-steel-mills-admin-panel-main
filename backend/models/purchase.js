const { Sequelize, DataTypes } = require('sequelize');
const {Database}=require('../database/Database')
const {supplier}=require("./suppliers")
const purchase = Database.sequelize.define(
    'purchase',
    {
        // Model attributes are defined here
        supplierName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        itemName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        kaat:{
            type:DataTypes.INTEGER,

            default:0
        },
        total:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        supplierId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    },

);

//defining association
supplier.hasMany(purchase,{
    onDelete: 'RESTRICT'
}) //defining the relation



// `sequelize.define` also returns the model
module.exports={purchase}