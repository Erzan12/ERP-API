import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserLocationDto } from './dto/create-user-location.dto';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class UserLocationService {
    constructor(private prisma: PrismaService) {}

    //query all available user locations
    async getAllUserLocations(user: RequestUser) {
        const user_location = await this.prisma.userLocation.findMany()
        if(!user_location) {
            throw new BadRequestException('No avaiable User Locations found');
        }
        return {
            status: 'sucess',
            message: 'Here are the list of User Locations.',
            data: {
                user_location,
            }
        }
    }
}
