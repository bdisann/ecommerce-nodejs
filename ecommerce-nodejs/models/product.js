const db = require("../util/db");
const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    if (this.id !== null) {
      return db.execute(
        "UPDATE products SET product_title=?, product_price=?, description=?, img_url=? WHERE id_product=?",
        [this.title, this.price, this.description, this.imageUrl, this.id]
      );
    } else {
      return db.execute(
        "INSERT INTO products (product_title, product_price, description, img_url) VALUES (?, ?, ?, ?)",
        [this.title, this.price, this.description, this.imageUrl]
      );
    }
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static fetchById(id) {
    return db.execute("SELECT * FROM products WHERE products.id_product=?", [
      id,
    ]);
  }

  static deleteById(id) {
    return db.execute("DELETE FROM products WHERE id_product=?", [id]);
  }
};
