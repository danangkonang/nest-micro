import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { AppService } from './app.service';

@Injectable()
export class AppConsumer implements OnModuleInit {
  constructor(private readonly appService: AppService) {}
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
    console.log('Listening...');
    this.channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log(data.email);
        let tmp = `<table>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Qty</th>
                        <th>Sub Total</th>
                      </tr>
                      `;
        data.menu.forEach((d: any, i: number) => {
          tmp += `<tr>
                    <td>${i + 1}</td>
                    <td>${d.name}</td>
                    <td>${d.qty}</td>
                    <td>${d.sub_total}</td>
                  </tr>`;
        });
        tmp += `
          <tr>
            <th colspan="3">Total</th>
            <th>${data.total}</th>
          </tr>
        </table>`;
        await this.appService.sendMail(data.email, 'Notification', tmp);
        this.channel.ack(msg);
      }
    });
  }
}
