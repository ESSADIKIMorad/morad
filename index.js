const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");

let PORT = 5000; 
app.use(cors());
app.use(express.json());
app.get("/vendor", async (req, res) => {
    try {
      const allTodos = await pool.query("SELECT * FROM vendor");
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });

  app.post("/vendor/new", async (req, res) => {
    const { vendorcode, name, contactperson, areacode, phone, country, previousorder } = req.body;
    try {
      const newVendor = await pool.query("INSERT INTO Vendor VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", 
      [vendorcode, name, contactperson, areacode, phone, country, previousorder])
      res.json(newVendor.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(404).send("A problem occured while adding a new vendor");
    }
  })
  app.get("/vendor/:vendor_id", async (req, res) => {
    const { vendor_id } = req.params;
    try {
      const vendor = await pool.query("SELECT * FROM Vendor WHERE vendorcode = $1", [vendor_id]);
      if(vendor.rows.length === 0) {
        res.status(404).send("Vendor not found");
      } else {
        res.json(vendor.rows[0]);
      }
    } catch (err) {
      console.error(err.message);
    }
  })

  app.delete("/vendor/:vendor_id", async (req, res) => {
    try {
      const deleteTodo = await pool.query("DELETE FROM Vendor WHERE vendorcode = $1", [req.params.vendor_id]);
      res.json("Todo deleted successfully");
    } catch (err) {
      console.error(err.message);
    }
  })
  app.put("/vendor/:vendor_id", async (req, res) => {
    try {
      const { vendor_id } = req.params;
      const { contactperson } = req.body;
      const updateTodo = await pool.query(
        "UPDATE vendor SET contactperson = $1 WHERE vendorcode = $2",
        [contactperson, vendor_id]
      );
  
      res.json("vendor was updated!");
    } catch (err) {
      console.error(err.message);
    }
  });
  

app.listen(PORT, () => {
	console.log(`Server is listening on Port ${PORT}`);
});
