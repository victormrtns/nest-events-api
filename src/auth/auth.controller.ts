import { Controller, Post, UseGuards,Request, Get, SerializeOptions, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { User } from "./user.entity";
import { CurrentUser } from "./current-user.decorator";
import { AuthGuardJwt } from "./auth-guard.jwt";
import { AuthGuardLocal } from "./auth-guard.local";
@Controller('auth')
@SerializeOptions({strategy:'excludeAll'})
export class AuthController {
    constructor(
    private readonly authService: AuthService
    ) { }

    @Post('login')
    @UseGuards(AuthGuardLocal)
    async login(@CurrentUser() user:User) {
    return {
        userId: user.id,
        token: this.authService.getTokenForUser(user)
    }
    }

    @Get('profile')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async getProfile(@CurrentUser() user:User) {
        return user;
    }
}
