const mongoDb = require('mongodb');

const db = require('../data/database');

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = +productData.price;
        this.description = productData.description;
        this.image = productData.image;
        this.updateImageData();
        if (productData._id) {
            this.id = productData._id.toString();
        }
    }

    static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();
        return products.map(function(productDocument) {
            return new Product(productDocument);
        });
    }

    static async findById(id) {
        let productId;
        try {
            productId = new mongoDb.ObjectId(id);
        } catch(error) {
            error.code = 404;
            throw error;
        }

        const product = await db.getDb().collection('products').findOne({ _id: productId });

        if (!product) {
            const error = new Error('Could not find product with provided id');
            error.code = 404;
            throw error;
        }
        return new Product(product);
    }

    updateImageData() {
        this.imagePath = `product-data/images/${this.image}`;
        this.imageUrl = `/products/assets/images/${this.image}`;
    }

    async save() {
        const productData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image,
          };

          let productId;
          if (this.id) {
            productId = new mongoDb.ObjectId(this.id);
      
            if (!this.image) {
              delete productData.image;
            }
      
            await db.getDb().collection('products').updateOne(
              { _id: productId },
              {
                $set: productData,
              }
            );
          } else {
            await db.getDb().collection('products').insertOne(productData);
          }
    }
    
    replaceImage(newImage) {
        this.image = newImage;
        this.updateImageData();
    }

    async remove() {
        const productId = new mongoDb.ObjectId(this.id);
        await db.getDb().collection('products').deleteOne({ _id: productId });
        return;
    }
}

module.exports = Product;