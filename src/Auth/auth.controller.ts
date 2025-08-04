import { Body, Controller, Post, Query, ValidationPipe, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../Components/decorators/public.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { ApiLoginResponse, ApiPostResponse } from '../Components/helpers/swagger-response.helper';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'User authorized login' })
    @ApiLoginResponse('User login successful')
    @Public()
    @UsePipes(new ValidationPipe ({whitelist:true}))
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'User reset password'})
    @ApiPostResponse('User reset password successfully')
    @Public()
    @UsePipes(new ValidationPipe ({whitelist:true}))
    async passwordResetWithToken(
        @Query('token') token: string,
        @Body() resetPasswordWithTokenDto: ResetPasswordWithTokenDto,
        ) {
        return this.authService.resetPasswordWithToken(resetPasswordWithTokenDto, token);
    }

    // <<<----- REFRESH TOKENS TESTING CONTROLLER ----->>>
    // @Post('login')
    // async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    // const { username, password } = loginDto;
    // const user = await this.authService.validateUser(username, password);
    // const accessToken = this.authService.generateAccessToken(user);
    // const refreshToken = this.authService.generateRefreshToken(); // random UUID or secure string

    // await this.prisma.refreshToken.create({
    //     data: {
    //     user_id: user.id,
    //     token: refreshToken,
    //     // expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days 
    //     expires_at: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes for testing purposes
    //     last_active_at: new Date(),
    //     },
    // });

    // //securing to cookie - use HTTPS 
    // // res.cookie('refresh_token', refreshToken, {
    // // httpOnly: true,
    // // secure: true,
    // // sameSite: 'strict',
    // // maxAge: 7 * 24 * 60 * 60 * 1000,
    // // });

    // // return {
    // //     status: 1,
    // //     message: 'Login successful',
    // //     token: accessToken,
    // // };

    // //DISPLAY IN JSON RESPONSE BODY
    // return {
    //     status: 1,
    //     message: 'Login successful',
    //     token: accessToken,
    //     refresh_token: refreshToken, // Can be moved to secure cookie if needed
    //     payload: {
    //         id: user.id,
    //         username: user.username,
    //         role: user.role.name,
    //     },
    // }

    // Either return it in response body or as cookie/header
    // res.setHeader('x-refresh-token', refreshToken);
    // return res.json({ accessToken });
    // }

    // @Post('refresh')
    // async refresh(@Req() req: Request, @Res() res: Response) {
    //     // Grab refresh token from header or cookie
    //     const refreshToken = req.headers['x-refresh-token'] as string || req.cookies?.refreshToken;

    //     if (!refreshToken) {
    //     throw new UnauthorizedException('Refresh token missing');
    //     }

    //     try {
    //     const tokens = await this.authService.refreshTokens(refreshToken);
    //     // Optionally send refresh token as HttpOnly cookie:
    //     // res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });

    //     return res.json(tokens);
    //     } catch (error) {
    //     throw new UnauthorizedException(error.message);
    //     }
    // }
}

