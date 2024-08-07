const jwt=require('jsonwebtoken')
const ValidateRequest=async(req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization)
        return res.status(401).json({error:'You are not authorized '})
    //validate the token
    const token=authorization.split(" ")[1]
    try{
    const decode=await jwt.verify(token,process.env.JWT_SECRET)
    next()
    }catch (e) {
        return res.status(401).json({error:'token is expired or invalid'})
    }

}
module.exports={ValidateRequest}