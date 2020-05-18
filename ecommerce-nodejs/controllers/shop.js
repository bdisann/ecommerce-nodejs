const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, meta]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getDetailProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.fetchById(productId)
    .then(([product]) => {
      // console.log(product[0].product_title);
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product.product_title,
        path: "/product/" + productId,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, meta]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getDataCart((carts) => {
    // console.log(products);
    if (carts === 0) {
      res.render("shop/cart", {
        products: 0,
        totalPrice: 0,
        path: "/cart",
        pageTitle: "Your Cart",
        hasProduct: false,
      });
    } else {
      Product.fetchAll((products) => {
        const dataCart = [];
        for (product of products) {
          const productExist = carts.product.find(
            (prod) => prod.id === product.id
          );
          if (productExist) {
            dataCart.push({ products: product, qty: productExist.qty });
          }
        }
        res.render("shop/cart", {
          products: dataCart,
          totalPrice: carts.totalPrice,
          path: "/cart",
          pageTitle: "Your Cart",
          hasProduct: true,
        });
      });
    }
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.getProductById(productId, (product) => {
    Cart.addProductbyId(productId, product.price);
    res.redirect("/cart");
  });
};

exports.postDeleteCartById = (req, res, next) => {
  const cartId = req.body.cartId;
  console.log(cartId);
  Product.getProductById(cartId, (product) => {
    Cart.deleteProduct(cartId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
