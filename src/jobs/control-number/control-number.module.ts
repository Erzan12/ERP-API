import { Module } from '@nestjs/common';
import { ControlNumberService } from './control-number.service';
import { PrismaModule } from 'src/config/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [ControlNumberService],
  exports: [ControlNumberService],
})
export class ControlNumberModule {}
