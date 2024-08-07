const {Validator} = require("../../utils/Validator");
const {Constants} = require("../../constants/Constants");
const {supplier} = require("../../models/suppliers");
const supplierUpdate=async (req,res)=>{
   try{
       const {firstName,lastName,contactNumber,id}=req.body
       if(!firstName || !lastName || !contactNumber){
           return res.status(400).json({error:'please provide all the fields'})
       }
       //perform the validation
       if (!(Validator.string(firstName, Constants.MIN_FIRSTNAME_LENGTH, Constants.MAX_FIRSTNAME_LENGTH) && Validator.string(lastName, Constants.MIN_LASTNAME_LENGTH, Constants.MAX_LASTNAME_LENGTH))) {
           return res.status(400).json({ error: 'Provide first and last name of minimum 3 and maximum 15 characters.' });
       }

       // Validate contact number length
       if (!Validator.string(contactNumber, 11, 11)) {
           return res.status(400).json({ error: 'Provide phone number of exactly 11 digits.' });
       }

       await supplier.update(
           {firstName,lastName,contactNumber},
           {
               where: {
                   id: id,
               },
           },
       );
       return res.status(204).json({error:'update success'})

   }catch (e){
       console.log('error occurred in supplier update',e)
       return res.status(500).json({error:'server error occurred'})
   }


}
module.exports={supplierUpdate}