import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    price: Number,
    rating: Number,
    discount: Number,
    type: String,
    color: String,
    size: String,
    style: String,
  },
  { timestamps: true }
);

const product = mongoose.model("Product", ProductSchema);
export default product;
