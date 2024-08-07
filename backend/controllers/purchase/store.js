const {purchase} = require("../../models/purchase");
const {Validator} = require("../../utils/Validator");

const purchaseStore=async(req,res)=>{
   try{
       const {supplierInfo,itemName,price,quantity,kaat}=req.body;
       const {firstName,id}=supplierInfo

       //validation here
       if(!Validator.string(itemName,3,20)){
           return res.status(400).send({error:'Item name must be 3 characters long'})
       }
       if(!Validator.number(price,1)){
           return res.status(400).send({error:'Item price must be greater than 1'})
       }
       if(!Validator.number(quantity,1)){
           return res.status(400).send({error:'Item quantity must be greater than 1'})
       }

       //if validation passes
       await purchase.create({
           supplierName:firstName,
           quantity:quantity,
           price:price,
           total:(quantity-(!kaat?0:kaat))*price,
           itemName:itemName,
           supplierId:id,
           kaat:!kaat?0:kaat
       })
       res.status(201).json({message:'purchase has been added successfully'})
   }catch (e){
       console.log('error occurred in purchase ',e)
       res.status(500).json({error:'An error occurred try again later'})
   }

}
module.exports={purchaseStore}