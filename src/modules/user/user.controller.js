import { db } from "../../database/connect.js";
import * as bcrypt from "bcryptjs";
const saltRounds = 4;

const getUsers = async (req, res) => {
  db.execute(`SELECT * FROM customers`, (err, data) => {
    if (err) return res.json(err);
    console.log(data);
    res.json(data);
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    db.execute(`SELECT * FROM customers WHERE email = '${email}'`, (err, data) => {
      if (!data.length)
        return res.status(404).json({ message: `User with email ${email} does not exist` });
      const hashPassword = data[0].password;
      bcrypt.compare(password, hashPassword, function (err, result) {
        result
          ? res.json({ message: "Login successful" })
          : res.status(401).json({
              message: `Login failed please check your email and password`,
            });
      });
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const signUp = async (req, res) => {
  const { fName, lName, email, phone, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    db.execute(
      `SELECT * FROM customers WHERE email = '${email}' OR  phone = '${phone}'`,
      (err, data) => {
        if (err) {
          return res.json(err);
        } else {
          if (data.length > 0) {
            return res.status(409).json({ message: "User already exists" });
          } else {
            db.execute(
              `INSERT INTO customers (fName, lName,email,password,phone) VALUES ('${fName}','${lName}','${email}','${hash}','${phone}')`,
              (err, data) => {
                if (err) {
                  return res.json(err);
                } else {
                  return res.json({ message: "User created successfully" });
                }
              }
            );
          }
        }
      }
    );
  });
};

export { getUsers, signUp, signIn };
