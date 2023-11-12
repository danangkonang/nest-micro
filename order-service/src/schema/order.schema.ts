import * as mongoose from 'mongoose';

export const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  __v: { type: Number, select: false },
});

export const OrderSchema = new mongoose.Schema({
  email: { type: String },
  status: { type: String, required: true },
  total: { type: Number },
  menu: [],
  __v: { type: Number, select: false },
});
