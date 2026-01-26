import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { EventService } from 'src/modules/events/event.service';

type EventsByTextQuery = {
  text: string;
};

@Controller('/events')
export class EventsController {
  constructor(private readonly eventsService: EventService) { }

  @Get('polymarket_by_text')
  async polymarketEventsByText(@Query() query: EventsByTextQuery) {
    if (!query.text) {
      throw new BadRequestException({
        message: 'Invalid query param - text',
      });
    }

    const events = await this.eventsService.findByTitlePolymarket({
      first: 100,
      skip: 0,
      title: query.text,
    });

    return events;
  }

  @Get('kalshi_by_text')
  async kalshiEventsByText(@Query() query: EventsByTextQuery) {
    if (!query.text) {
      throw new BadRequestException({
        message: 'Invalid query param - text',
      });
    }

    const events = await this.eventsService.findByTitleKalshi({
      first: 100,
      skip: 0,
      title: query.text,
    });

    return events;
  }
}
