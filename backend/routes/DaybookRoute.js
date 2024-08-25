const daybookController = require('../controller/DayController');
const middleware = require('../middleware/UserMiddleware');
const router = require('express').Router();

router.use(middleware.verifyToken);
router.use(middleware.verifyAccountStatus);

// Static routes first to avoid conflicts with dynamic routes
router.get('/reports/rates', daybookController.getPurchasesSalesAverageRate); // Make sure this comes first
router.get('/reports', daybookController.generateReports); 
router.get('/reports/supplier/:id', daybookController.getSupplierTransactions);

// Dynamic route should come after static routes
router.get('/:id', daybookController.getTransactionById);

router.get('/', daybookController.getTransactions);

router.post('/register', daybookController.recordDaybookEntry);

router.delete('/delete/:id', daybookController.deleteTransaction);

router.put('/update/:id', daybookController.updateTransaction);

module.exports = router;
