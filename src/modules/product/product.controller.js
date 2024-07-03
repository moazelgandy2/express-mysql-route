import { db } from "../../database/connect.js";
import bcrypt from "bcrypt";
const saltRounds = 4;

const getProducts = async (req, res) => {
  db.execute(`SELECT * FROM PRODUCTS`, (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.json({ message: "No products found" });
    console.log(data);
    res.json(data);
  });
};

const addProduct = async (req, res) => {
  const { name, price, category } = req.body;
  db.execute(
    `INSERT INTO PRODUCTS (name, price, category) VALUES ('${name}', '${price}', '${category}')`,
    (err, data) => {
      if (err) return res.json(err);
      res.json({ message: "Product added successfully" });
    }
  );
};

const getTotalRevenue = async (req, res) => {
  try {
    const [categoriesResult] = await db.promise().query(`SELECT DISTINCT CATEGORY FROM PRODUCTS`);
    if (categoriesResult.length === 0) return res.json({ message: "No categories found" });

    const categories = categoriesResult.map((row) => row.CATEGORY);
    const revenuePromises = categories.map(async (category) => {
      const [result] = await db
        .promise()
        .query(`SELECT SUM(PRICE) as total FROM PRODUCTS WHERE CATEGORY = ?`, [category]);
      return { category, total: result[0].total };
    });

    const revenue = await Promise.all(revenuePromises);
    res.json(revenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const totalItemsSold = async (req, res) => {
  db.query(`SELECT order_items FROM orders`, (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    console.log(data);

    const totalItemsSold = {};

    data.forEach((row) => {
      const orderItems = JSON.parse(row.order_items);

      orderItems.forEach((item) => {
        const productId = item.productid;
        const quantity = item.quantity;

        if (!totalItemsSold[productId]) {
          totalItemsSold[productId] = 0;
        }

        totalItemsSold[productId] += quantity;
      });
    });

    const productIds = Object.keys(totalItemsSold);

    db.query(`SELECT id, name FROM products WHERE id IN (?)`, [productIds], (err, products) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const result = products.map((product) => ({
        name: product.name,
        totalSold: totalItemsSold[product.id],
      }));

      res.json(result);
    });
  });
};

export { getProducts, addProduct, getTotalRevenue, totalItemsSold };
