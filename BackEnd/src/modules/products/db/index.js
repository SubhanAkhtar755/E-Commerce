import Product from "../models/index.js";

// Get One by ID
const getData = async (id) => {
  if (!id) return null;
  return await Product.findById(id);
};

// Get All
const getAllData = async () => await Product.find();

// Create
const PostData = async (Data) =>
  new Product(Data).save().then((doc) => doc.toObject());

// Update
const updateData = async (id, data) =>
  await Product.findByIdAndUpdate(id, data, { new: true });

// Delete
const deleteData = async (id) => await Product.findByIdAndDelete(id);

export { getData, getAllData, PostData, updateData, deleteData };
