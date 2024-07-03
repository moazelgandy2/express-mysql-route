import mysql2 from "mysql2";

export const db = mysql2.createConnection({
  host: "b2np4mpxyz4p4pll113r-mysql.services.clever-cloud.com",
  user: "your_username",
  password: "your_password",
  database: "your_database",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database!");
});
