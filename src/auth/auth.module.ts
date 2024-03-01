import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

@Module({
    //So now we can inject the user repository
    imports:[TypeOrmModule.forFeature([User]),
JwtModule.registerAsync({
    useFactory:() => ({
        secret:process.env.AUTH_SECRET,
        signOptions:{
            expiresIn:'60m'
        }
    })
})],
    providers:[LocalStrategy,AuthService],
    controllers:[AuthController]
})
export class AuthModule{}
