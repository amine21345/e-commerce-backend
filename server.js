import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { productData, ratingData } from "./data/data.js";
import product from "./models/product.js";
import Rating from "./models/rating.js";
// data imports

const uri = "mongodb://127.0.0.1:27017/e-commerce";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ROUTES

const port = 5000;
mongoose
  .connect(uri)
  .then(() => {
    app.listen(port, () => console.log("server running on port " + port));
    // product.insertMany(productData);
  })
  .catch((error) => console.log(error));

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    const { types, sizes, colors, styles, price } = req.query;

    // Convert query parameters into arrays or default to empty arrays
    const typesArray = types ? types.split(",") : [];
    const sizesArray = sizes ? sizes.split(",") : [];
    const colorsArray = colors ? colors.split(",") : [];
    const stylesArray = styles ? styles.split(",") : [];
    const priceArray = price ? price.split(",").map(Number) : [];

    // Fetch products from the database (replace with your actual database query)
    let products = await product.find();

    // Apply filtering based on query parameters
    if (typesArray.length > 0) {
      products = products.filter((product) =>
        typesArray.includes(product.type)
      );
    }
    if (sizesArray.length > 0) {
      products = products.filter((product) =>
        sizesArray.includes(product.size)
      );
    }
    if (colorsArray.length > 0) {
      products = products.filter((product) =>
        colorsArray.includes(product.color)
      );
    }
    if (stylesArray.length > 0) {
      products = products.filter((product) =>
        stylesArray.includes(product.style)
      );
    }
    if (priceArray.length === 2) {
      const [minPrice, maxPrice] = priceArray;
      products = products.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// GET a product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

// GET all ratings
app.get("/api/ratings", async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error });
  }
});
