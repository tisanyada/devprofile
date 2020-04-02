const router = require('express').Router();
const indexController = require('../../controllers/public/index');



router.get('/login', indexController.getLogin);



module.exports = router;