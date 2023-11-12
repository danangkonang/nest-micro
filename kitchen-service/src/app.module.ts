import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { RmqConsumer } from './rmq/consumer.rmq';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
      dbName: 'restaurant',
    }),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [],
  providers: [RmqConsumer],
})
export class AppModule {}
