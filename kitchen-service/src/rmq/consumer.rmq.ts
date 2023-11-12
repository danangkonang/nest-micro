import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as amqplib from 'amqplib';
import { Model } from 'mongoose';
import { Order } from '../interface/order.interface';

@Injectable()
export class RmqConsumer implements OnModuleInit {
  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<Order>,
  ) {}
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;

  async onModuleInit() {
    await this.connect();
    await this.setupFanoutExchange('orders');
    await this.consumeMessages('order.notification');
  }

  private async connect() {
    this.connection = await amqplib.connect('amqp://rabbitmq:5672');
    this.channel = await this.connection.createChannel();
  }

  private async setupFanoutExchange(exchangeName: string) {
    await this.channel.assertExchange(exchangeName, 'fanout', {
      durable: false,
    });
  }
  private async consumeMessages(queueName: string) {
    await this.channel.assertQueue(queueName, { durable: false });
    await this.channel.bindQueue(queueName, 'orders', '');
    this.channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        await this.orderModel
          .findByIdAndUpdate(
            data._id,
            {
              status: 'PROCESSED',
            },
            { new: true },
          )
          .exec();
        this.channel.ack(msg);
      }
    });
  }
}
