import { Body, Controller, Post, Put, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, ResetPasswordDto, SendResetPasswordDto, SignInDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    login(@Body() signInDto: SignInDto) {
        return this.authService.login(signInDto);
    }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('send-reset-password')
    sendResetPasswordEmail(@Body() sendResetPasswordDto: SendResetPasswordDto) {
        return this.authService.sendResetPasswordEmail(sendResetPasswordDto);
    }

    @Post('reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
