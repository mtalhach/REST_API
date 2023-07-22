const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//connect with mongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/sample-1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

//schema
const productSchema = {
  name: String,
  description: String,
  price: Number,
};

//model
const productModel = mongoose.model("product", productSchema);

//////////////////////////////////////////////////////////
//POST (create product)
app.post("/api/vi/product/new", async (req, res) => {
  const data = new productModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  });
  const Product = await data.save(); //save in mongoDb database
  res.json(Product);
});

//////////////////////////////////////////////////////////
//GET (Read Product)
app.get("/api/vi/products", async (req, res) => {
  const products = await productModel.find();
  res.json(products);
});

//////////////////////////////////////////////////////////
//PUT (update product By ID)
app.put("/api/vi/product/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, description, price } = req.body;
  productModel
    .findByIdAndUpdate(
      userId,
      { name, description, price },
      { new: true } // This ensures the updated document is returned
    )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(updatedUser);
    })
    .catch((err) => {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    });
});

//////////////////////////////////////////////////////////
//DELETE (delete product by ID)
app.delete("/api/vi/product/delete/:id", (req, res) => {
  const userId = req.params.id;

  productModel
    .findByIdAndRemove(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(deletedUser);
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    });
});

//server
app.listen(3000, () => {
  console.log("server is working on http://localhost:3000");
});
