import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { LocalStrategy } from "./local.strategy";

@Module({
    //So now we can inject the user repository
    imports:[TypeOrmModule.forFeature([User])],
    providers:[LocalStrategy]
})
export class AuthModule{}
