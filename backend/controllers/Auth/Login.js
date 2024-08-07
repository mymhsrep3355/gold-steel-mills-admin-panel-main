const {Validator} = require("../../utils/Validator");
const {user} = require("../../models/user");
const jwt=require('jsonwebtoken')
const Login=async(req,res)=>{
    try{
        console.log(req.cookies)
        const {username,password}=req.body
        if(!username||!password){
            return res.status(400).json({error:'Provide username and password'})
        }
        if(!Validator.string(username,3,16))
            return res.status(400).json({error:'username must be between 3 to 16 characters '})
        if(!Validator.string(password,3,8))
            return res.status(400).json({error:'password must be between 3 to 8 characters '})

        //check if user exists
        const existing_user = await user.findOne({ where: { username,password } });
        if(existing_user==null)
            return res.status(401).json({error:'Invalid username or password'})

        //generate the jwt access token for authentication
        const token=await jwt.sign({id:existing_user.id,username},process.env.JWT_SECRET,{expiresIn: "24h"});

        return res.status(200).json({user:existing_user,token})
    }catch(e){
        console.log(e)
        return res.status(500).json({error:'An error occurred...'})
    }
}
module.exports={Login}