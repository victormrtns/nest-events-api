import { Injectable } from "@nestjs/common";
import {User} from './user.entity'
import {JwtService} from "@nestjs/jwt"
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
}