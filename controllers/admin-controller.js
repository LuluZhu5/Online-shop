const Product = require('../models/product-model');

async function getProducts(req, res, next) {
    try {
        const products = await Product.findAll();
        res.render('admin/products/all-products', { products: products });
    } catch(error) {
        next(error);
        return;
    }
    
}

function getNewProducts(req, res) {
    res.render('admin/products/new-product');
}

async function createNewProducts(req, res, next) {
    const product = new Product({
        ...req.body,
        image: req.file.filename
    });

    try {
        product.save();
    } catch(error) {
        next(error);
        return;
    }
    
    res.redirect('/admin/products');
}

module.exports = {
    getNewProducts: getNewProducts,
    getProducts: getProducts,
    createNewProducts, createNewProducts,

}
