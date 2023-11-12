import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu, Order } from './interface/order.interface';
import { StoreOrderDto, StoreMenuDto } from './dto/order.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Menu')
    private readonly menuModel: Model<Menu>,
    @InjectModel('Order')
    private readonly orderModel: Model<Order>,
  ) {}

  async storeMenu(payload: StoreMenuDto): Promise<Menu> {
    try {
      const data = new this.menuModel({
        name: payload.name,
        price: payload.price,
      });
      const menu = await data.save();
      return menu;
    } catch (error) {
      throw error;
    }
  }

  async findAllmenu(): Promise<Menu[]> {
    try {
      const menu = await this.menuModel.find();
      return menu;
    } catch (error) {
      throw error;
    }
  }

  async findAllmenuById(id: string): Promise<Menu> {
    try {
      const menu = await this.menuModel.findById({ _id: id });
      return menu;
    } catch (error) {
      throw error;
    }
  }

  async findAllmenuByName(name: string): Promise<Menu> {
    try {
      const menu = await this.menuModel.findOne({ name: name });
      return menu;
    } catch (error) {
      throw error;
    }
  }

  async storeOrder(payload: StoreOrderDto): Promise<Order> {
    try {
      const data = new this.orderModel(payload);
      const menu = await data.save();
      return menu;
    } catch (error) {
      throw error;
    }
  }

  async findAllOrder(): Promise<Order[]> {
    try {
      const order = await this.orderModel.find();
      return order;
    } catch (error) {
      throw error;
    }
  }

  async findOrderById(id: string): Promise<Order> {
    try {
      const order = await this.orderModel.findById({ _id: id });
      return order;
    } catch (error) {
      throw error;
    }
  }
}
