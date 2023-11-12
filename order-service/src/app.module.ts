import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RmqService } from './rmq/rmq.service';
import { MenuSchema, OrderSchema } from './schema/order.schema';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserSchema } from './schema/auth.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'restaurant',
    }),
    MongooseModule.forFeature([
      { name: 'Menu', schema: MenuSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'User', schema: UserSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: 'SECREAT',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, RmqService, AuthService],
})
export class AppModule {}
