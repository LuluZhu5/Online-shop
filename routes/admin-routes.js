const express = require('express');

const adminController = require('../controllers/admin-controller');
const imageUploadMiddleware = require('../middlewares/image-upload')

const router = express.Router();

router.get('/products', adminController.getProducts);

router.get('/products/new', adminController.getNewProducts);

router.post('/products', imageUploadMiddleware, adminController.createNewProducts)

module.exports = router;
