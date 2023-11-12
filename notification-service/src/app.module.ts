import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConsumer } from './app.consumer';

@Module({
  imports: [],
  controllers: [],
  providers: [AppConsumer, AppService],
})
export class AppModule {}
