import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/datasources/database/database.module';
import { eventProviders } from './event.providers';
import { EventService } from './event.service';

@Module({
  imports: [DatabaseModule],
  providers: [...eventProviders, EventService],
  exports: [...eventProviders, EventService],
})
export class EventModule {}
