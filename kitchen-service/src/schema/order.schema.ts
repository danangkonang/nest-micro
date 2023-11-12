import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  email: { type: String },
  status: { type: String, required: true },
  total: { type: Number },
  menu: [],
  __v: { type: Number, select: false },
});
