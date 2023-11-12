import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';

@Injectable()
export class RmqService implements OnModuleInit, OnModuleDestroy {
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;

  async onModuleInit() {
    await this.connect();
    await this.setupFanoutExchange('orders');
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  private async connect() {
    this.connection = await amqplib.connect('amqp://localhost:5672');
    this.channel = await this.connection.createChannel();
  }

  async setupFanoutExchange(exchangeName: string) {
    await this.channel.assertExchange(exchangeName, 'fanout', {
      durable: false,
    });
  }

  setMessage(exchangeName: string, message: string) {
    this.channel.publish(exchangeName, '', Buffer.from(message));
  }
}
