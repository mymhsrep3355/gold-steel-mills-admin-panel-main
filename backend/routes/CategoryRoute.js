const CategoryController = require('../controller/CategoryController');
const express = require('express');
const router = express.Router();
const middleware = require('../middleware/UserMiddleware');

router.use(middleware.verifyToken);
router.use(middleware.verifyAccountStatus);

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);

router.post('/register', CategoryController.createCategory);

router.delete('/delete/:id', CategoryController.deleteCategory);

router.put('/update/:id', CategoryController.updateCategory);


module.exports = router