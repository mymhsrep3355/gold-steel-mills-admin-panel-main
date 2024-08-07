require('dotenv').config();

const {ValidateRequest} = require("./middleware/ValidateRquest");
const {Database}=require('./database/Database');
const {config}=require("./database/config")
new Database(config);

const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')

const app=express();
const {router}=require("./router/router")
const {user} = require("./models/user");

//middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(ValidateRequest);

app.use("/api/v1",router);

const port=process.env.SERVER_PORT||8080;
app.listen(port,async function(){
    await Database.sequelize.sync()
    await user.sync();
    console.log('server is listening and running on port',port);
})



