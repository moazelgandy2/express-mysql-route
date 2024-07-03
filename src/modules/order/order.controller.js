import { db } from "../../database/connect.js";

const getOrder = async (req, res) => {
  db.execute(`SELECT * FROM orders`, (err, data) => {
    if (err) return res.json(err);

    if (data.length === 0) return res.json({ message: "No orders found" });

    const orders = data.map((row) => {
      return {
        id: row.id,
        customer_id: row.customer_id,
        order_items: JSON.parse(row.order_items),
        total: row.total,
        createdAt: row.createdAt,
      };
    });

    res.json(orders);
  });
};

const addOrder = async (req, res) => {
  const { customer_id, order_items, total } = req.body;

  if (!customer_id || !order_items || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    `INSERT INTO orders (customer_id, order_items, total) VALUES (?, ?, ?)`,
    [customer_id, JSON.stringify(order_items), total],
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({ message: "Order created successfully", orderId: data.insertId });
    }
  );
};

const getAvgOrderValue = async (req, res) => {
  db.query(`SELECT AVG(total) AS averageOrderValue FROM orders`, (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const averageOrderValue = data[0].averageOrderValue;
    const formattedAvgOrderValue = parseFloat(averageOrderValue).toFixed(2);
    res.json({ averageOrderValue: +formattedAvgOrderValue });
  });
};

const customersWithoutOrders = async (req, res) => {
  db.query(
    `SELECT c.id, c.fName, c.lName, c.email
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        WHERE o.customer_id IS NULL`,
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(data);
    }
  );
};

const getMostPurchased = async (req, res) => {
  db.query(
    `     SELECT c.id, c.fName, c.lName, c.email, SUM(JSON_LENGTH(JSON_EXTRACT(o.order_items, '$[*].quantity'))) AS totalItemsPurchased
        FROM customers c
        JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id, c.fName, c.lName, c.email
        ORDER BY totalItemsPurchased DESC
        LIMIT 1`,
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ message: "No customers found" });
      }

      res.json(data[0]);
    }
  );
};

const getTopCustomers = async (req, res) => {
  db.query(
    `SELECT c.id, c.fName, c.lName, c.email, SUM(o.total) AS totalSpent
        FROM customers c
        JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id, c.fName, c.lName, c.email
        ORDER BY totalSpent DESC
        LIMIT 10`,
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(data);
    }
  );
};

const getCustomersWithFiveOrders = async (req, res) => {
  db.query(
    `SELECT c.id, c.fName, c.lName, c.email, COUNT(o.id) AS orderCount
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id, c.fName, c.lName, c.email
        HAVING orderCount >= 5`,
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(data);
    }
  );
};

const getRepeatCustomerRate = async (req, res) => {
  db.query(
    ` SELECT COUNT(id) AS totalCustomers
        FROM customers`,
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const totalCustomers = data[0].totalCustomers;

      db.query(
        ` 
        SELECT COUNT(DISTINCT customer_id) AS customersMoreThanOneOrder
        FROM orders
        GROUP BY customer_id
        HAVING COUNT(id) > 1
        `,
        (err, customersMoreThanOneOrderResult) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const customersMoreThanOneOrder = customersMoreThanOneOrderResult.length;
          const percentage = (customersMoreThanOneOrder / totalCustomers) * 100;

          res.json({ percentage: percentage.toFixed(2) });
        }
      );
    }
  );
};

const getCustomersEarliestOrder = async (req, res) => {
  db.query(
    ` SELECT c.id, c.fName, c.lName, c.email, MIN(o.createdAt) AS earliestOrderDate
      FROM customers c
      JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id, c.fName, c.lName, c.email
      ORDER BY earliestOrderDate ASC
      LIMIT 1;
    `,
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ message: "No customers found with orders" });
      }

      res.json(data[0]);
    }
  );
};

export {
  getOrder,
  addOrder,
  getAvgOrderValue,
  customersWithoutOrders,
  getMostPurchased,
  getTopCustomers,
  getCustomersWithFiveOrders,
  getRepeatCustomerRate,
  getCustomersEarliestOrder,
};
