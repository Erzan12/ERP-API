import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomJwtAuthGuard } from '../Components/middleware/jwt.auth.guard';

// <-- APPLIED NESTED CONTROLLERS INSIDE GLOBAL.CONTROLLER.TS -->
@Controller('user-home')
@UseGuards(CustomJwtAuthGuard)
export class HomeController {

    @Get()
    getUserData() {
        return { message: 'User Access Granted. Your Home'}
    }
}

@Controller('user-profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {

    @Get()
    getUserData() {
        return { message: 'User Access Granted. Here is your Profile'}
    }
} 
