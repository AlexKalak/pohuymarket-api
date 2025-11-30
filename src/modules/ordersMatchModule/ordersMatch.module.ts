import { DatabaseModule } from 'src/datasources/database/database.module';
import { ordersMatchProviders } from './ordersMatch.provides';
import { Module } from '@nestjs/common';
import { OrdersMatchService } from './ordersMatch.service';

@Module({
  imports: [DatabaseModule],
  providers: [...ordersMatchProviders, OrdersMatchService],
  exports: [OrdersMatchService],
})
export class OrdersMatchModule {}
