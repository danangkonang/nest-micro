import { Document } from 'mongoose';

export interface Order extends Document {
  email: string;
  status: string;
  menu: Menu[];
  total: number;
}

export interface Menu extends Document {
  menu_id: string;
  status: string;
  qty: number;
  sub_total: number;
}
