const PurchaseController = require('../controller/PurchaseController');
const express = require('express');
const router = express.Router();

const middleware = require('../middleware/UserMiddleware');
router.use(middleware.verifyToken);
router.use(middleware.verifyAccountStatus);


router.get('/getBilletScrape', PurchaseController.getScrapeOfBillet);
router.get('/supplier', PurchaseController.getPurchaseBySupplier);
router.get('/', PurchaseController.getAllPurchases);


router.get('/:id', PurchaseController.getPurchaseById);


router.post('/register', PurchaseController.createPurchase);

router.delete('/delete/:id', PurchaseController.deletePurchase);

router.put('/update/:id', PurchaseController.updatePurchase);

module.exports = router