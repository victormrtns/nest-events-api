import { Injectable } from "@nestjs/common";
import {User} from './user.entity'
import {JwtService} from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
@Injectable()
export class AuthService{
    constructor(
        private readonly jwtService: JwtService,
    ){}
    public getTokenForUser(user:User): string {
        return this.jwtService.sign({
            username:user.username,
            sub: user.id
        })
    }

    public async hashPassword(password:string):Promise<string>{
        return await bcrypt.hash(password,10)
    }
}