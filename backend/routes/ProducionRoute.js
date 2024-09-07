const middleware = require('../middleware/UserMiddleware');
const router = require('express').Router();

router.use(middleware.verifyToken, middleware.verifyAccountStatus);



const productionController = require('../controller/ProductionController');


router.get('/', productionController.getAllProductions);
router.get('/:id', productionController.getProductionById);

router.post('/register', productionController.createProduction);

router.put('/updateWaste', productionController.updateProductionWaste);
router.put('/update/:id', productionController.updateProduction);


router.delete('/delete/:id', productionController.deleteProduction);

module.exports = router;