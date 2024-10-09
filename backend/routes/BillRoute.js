const router = require('express').Router();

const middleware = require('../middleware/UserMiddleware');
router.use(middleware.verifyToken);
router.use(middleware.verifyAccountStatus);

const billController = require('../controller/BillController');

router.get('/', billController.getAllBills);

router.get('/:id', billController.getBillById);

router.post('/register', billController.createBill);

router.delete('/delete/:id', billController.deleteBill);

router.put('/update/:id', billController.updateBill);

module.exports = router;