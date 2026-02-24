import { Module } from '@nestjs/common';
// import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [SlackService],
})
export class SlackModule {}
