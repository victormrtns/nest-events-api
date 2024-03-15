import { Controller, Post, UseGuards,Request, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { User } from "./user.entity";
import { CurrentUser } from "./current-user.decorator";
@Controller('auth')
export class AuthController {
    constructor(
    private readonly authService: AuthService
    ) { }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@CurrentUser() user:User) {
    return {
        userId: user.id,
        token: this.authService.getTokenForUser(user)
    }
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@CurrentUser() user:User) {
        return user;
    }
}
