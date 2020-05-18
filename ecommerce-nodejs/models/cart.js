const fs = require('fs');
const path = require('path');

const cartDataPath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
  );

module.exports = class Cart {
    static addProductbyId(id, productPrice){
        // fecth previous data in cart
        fs.readFile(cartDataPath, (err, fileContent) => {
            let cart = {product: [], totalPrice:0};
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // analyze the cart => find product index existing product in there
            const existingProductIndex = cart.product.findIndex(product => product.id === id);
            // initialize the index product to confirm the product is there
            const existingProduct = cart.product[existingProductIndex];
            let updatedProduct;
            // check for existing product to confirm the product is there
            if (existingProduct) {
                // if product is there, then confirm product and increase qty
                updatedProduct = {...existingProduct};
                updatedProduct.qty += 1;
                cart.product = [...cart.product];
                cart.product[existingProductIndex] = updatedProduct;
            } else {
                // else, make a new arr on cart.product and push into it.
                updatedProduct = {id: id, qty:1};
                cart.product = [...cart.product, updatedProduct];
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(cartDataPath, JSON.stringify(cart), err => console.log(err));

        })
    }

    static getDataCart(cb){
        fs.readFile(cartDataPath, (err, fileContent) => {
            const empty = 0;
            if (err) {
                cb(empty);
            } else{
                cb(JSON.parse(fileContent));
            }
        })       
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(cartDataPath, (err, fileContent) => {
            if (!err) {
                const cartData = {...JSON.parse(fileContent)};
                const product = cartData.product.find(product => product.id === id);
                if(!product){
                    return;
                }
                const productQty = product.qty;
                cartData.product = cartData.product.filter(product => product.id !== id);
                cartData.totalPrice = cartData.totalPrice - productPrice * productQty;
                fs.writeFile(cartDataPath, JSON.stringify(cartData), err => console.log(err))
            } else {
                return;
            }
        })
    }
}