const {  DataTypes } = require('sequelize');
const {Database}=require('../database/Database')

const user = Database.sequelize.define(
    'user',
    {

        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    },
);

// `sequelize.define` also returns the model
module.exports={user}