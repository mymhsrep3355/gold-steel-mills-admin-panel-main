const {Router}=require('express')
const router=Router();
//suppliers
const {supplierStore}=require("../controllers/supplier/store")
const {suppliers}=require("../controllers/supplier/suppliers")
const {supplierDestroy} = require("../controllers/supplier/destroy");
const {supplierUpdate} = require("../controllers/supplier/update");


//purchases
const {purchases}=require("../controllers/purchase/purchases")
const {purchaseStore} = require("../controllers/purchase/store");
const {Login} = require("../controllers/Auth/Login");
const {ValidateRequest} = require("../middleware/ValidateRquest");
const {purchaseDestroy} = require("../controllers/purchase/destroy");
const {PurchaseUpdate} = require("../controllers/purchase/update");

//Auth routes



router.post("/auth/login",Login)

//suppliers
router.get("/suppliers",ValidateRequest,suppliers)
router.post("/supplier/store",ValidateRequest,supplierStore)
router.delete("/suppliers",ValidateRequest,supplierDestroy)
router.post("/supplier/:id",ValidateRequest,supplierUpdate)


//purchases
router.get("/purchases",ValidateRequest,purchases)
router.post('/purchase/store',ValidateRequest,purchaseStore)
router.delete("/purchases",ValidateRequest,purchaseDestroy)
router.post("/purchase/:id",ValidateRequest,PurchaseUpdate)


module.exports={router}