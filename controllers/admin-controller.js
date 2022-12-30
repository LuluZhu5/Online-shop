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

async function getEditProduct(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        res.render('admin/products/edit-product', { product: product });
    } catch(error) {
        next(error);
        return;
    }
}

async function editProduct(req, res, next) {
    const product = new Product({
        ...req.body,
        _id: req.params.id
    });

    if (req.file) {
        product.replaceImage(req.file.filename);
    }

    try {
        await product.save();
    } catch(error) {
        next(error);
        return;
    }

    res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        await product.remove();
    } catch(error) {
        return next(error);
    }

    res.json({ message: 'Deleted product!' });
}

module.exports = {
    getNewProducts: getNewProducts,
    getProducts: getProducts,
    createNewProducts, createNewProducts,
    getEditProduct: getEditProduct,
    editProduct: editProduct,
    deleteProduct: deleteProduct,
}
