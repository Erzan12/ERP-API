import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [SmsService, PrismaService],
  exports: [SmsService],
  controllers: [SmsController],
})
export class SmsModule {}
