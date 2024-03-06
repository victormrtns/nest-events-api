import { Controller, Post, UseGuards,Request, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { User } from "./user.entity";
@Controller('auth')
export class AuthController {
    constructor(
    private readonly authService: AuthService
    ) { }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() request) {
    return {
        userId: request.user.id,
        token: this.authService.getTokenForUser(request.user)
    }
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Request() request) {
        return request.user;
    }
}
