import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/datasources/database/database.module';
import { orderProviders } from './orders.providers';
import { OrdersService } from './orders.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...orderProviders,
    OrdersService,
  ],
  exports: [OrdersService],
})
export class OrdersModule { }
