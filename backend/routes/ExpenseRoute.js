const router = require('express').Router();

const middleware = require('../middleware/UserMiddleware');
router.use(middleware.verifyToken);
router.use(middleware.verifyAccountStatus);

const expenseController = require('../controller/ExpenseController');


router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById);
router.get('/date/:date', expenseController.getExpensesByDate);

router.post('/register', expenseController.createExpense);

router.delete('/delete/:id', expenseController.deleteExpense);

router.put('/update/:id', expenseController.updateExpense);

module.exports = router