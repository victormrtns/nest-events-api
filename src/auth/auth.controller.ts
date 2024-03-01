import { Controller, Post, UseGuards,Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService:AuthService
    ){}
    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Request()request){ 
        return{
            userId:request.user.id,
            token:this.authService.getTokenForUser(request.user)
        }
    }
}
