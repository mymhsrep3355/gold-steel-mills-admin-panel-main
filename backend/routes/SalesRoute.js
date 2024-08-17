const sales = require('../controller/SalesController');

const express = require('express');
const router = express.Router();

const middleware = require('../middleware/UserMiddleware');
router.use(middleware.verifyToken);
router.use(middleware.verifyAccountStatus);


router.get('/', sales.getAllSales);

router.get('/:id', sales.getSalesById);

router.post('/register', sales.createSales);

router.delete('/delete/:id', sales.deleteSales);

router.put('/update/:id', sales.updateSales);

module.exports = router;
