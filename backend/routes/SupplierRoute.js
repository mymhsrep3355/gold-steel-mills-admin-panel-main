const router = require('express').Router();

const middleware = require('../middleware/UserMiddleware');
router.use(middleware.verifyToken);
router.use(middleware.verifyAccountStatus);

const supplierController = require('../controller/SupplierController');


router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);

router.post('/register', supplierController.createSupplier);

router.delete('/delete/:id', supplierController.deleteSupplier);

router.put('/update/:id', supplierController.updateSupplier);
router.put('/paymentReceived', supplierController.paymentReceived);
router.put('/paymentSent', supplierController.paymentSent);

module.exports = router;
