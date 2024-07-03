import mysql2 from "mysql2";

export const db = mysql2.createConnection({
  host: "b2np4mpxyz4p4pll113r-mysql.services.clever-cloud.com",
  user: "upe4h82dw5fvadjz",
  password: "upe4h82dw5fvadjz",
  database: "b2np4mpxyz4p4pll113r",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database!");
});
