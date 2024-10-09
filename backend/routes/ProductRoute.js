const ProductController = require('../controller/ProductController');
const express = require('express');
const router = express.Router();

const middleware = require('../middleware/UserMiddleware');
router.use(middleware.verifyToken);
router.use(middleware.verifyAccountStatus);


router.get('/', ProductController.getAllProducts);

router.get('/:id', ProductController.getProductById);

router.post('/register', ProductController.createProduct);

router.delete('/delete/:id', ProductController.deleteProduct);

router.put('/update/:id', ProductController.updateProduct);

module.exports = router;
