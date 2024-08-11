const daybookController = require('../controller/DayController');

const middleware = require('../middleware/UserMiddleware');
const router = require('express').Router();

router.use(middleware.verifyToken);
router.use(middleware.verifyAccountStatus);


router.get('/', daybookController.getTransactions);
router.get('/:id', daybookController.getTransactionById);

router.post('/register', daybookController.recordDaybookEntry);

router.delete('/delete/:id', daybookController.deleteTransaction);

router.put('/update/:id', daybookController.updateTransaction);

module.exports = router