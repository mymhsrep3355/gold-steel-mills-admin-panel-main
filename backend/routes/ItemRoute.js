const router = require('express').Router();

const middleware = require('../middleware/UserMiddleware');
router.use(middleware.verifyToken);
router.use(middleware.verifyAccountStatus);

const itemController = require('../controller/ItemController');


router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);

router.post('/register', itemController.createItem);

router.delete('/delete/:id', itemController.deleteItem);

router.put('/update/:id', itemController.updateItem);

module.exports = router;