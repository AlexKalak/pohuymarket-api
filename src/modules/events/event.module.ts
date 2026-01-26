import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/datasources/database/database.module';
import { eventProviders } from './event.providers';
import { EventService } from './event.service';
import { EventsController } from './event.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...eventProviders, EventService],
  exports: [...eventProviders, EventService],
  controllers: [EventsController],
})
export class EventModule {}
