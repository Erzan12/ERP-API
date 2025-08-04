import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PrismaService } from 'prisma/prisma.service';
import { PersonController } from './person.controller';
import { JwtStrategy } from '../../Components/middleware/jwt.strategy';

@Module({
    imports: [],
    controllers: [PersonController],
    providers: [PersonService, PrismaService,  JwtStrategy],
    exports: [PersonModule],
})
export class PersonModule {}
