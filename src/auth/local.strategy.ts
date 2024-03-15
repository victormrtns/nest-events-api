import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Repository } from "typeorm";
import {User} from "./user.entity"
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){        
    private readonly logger = new Logger(LocalStrategy.name)
    //To validate the user, we must have to inject the userrepository

    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>){
        super();
    }
    public async validate(username:string,password:string):Promise<any>{
        const user = await this.userRepository.findOne({
            where:{
                username
            }
        });
        if(!user){
            this.logger.debug(`This ${username} was not found`)
            throw new UnauthorizedException();
        }
        //Similar strategy, but u dont compare passwords without hashing
        // if(password != user.password){
        //     this.logger.debug(`Invalid Credentials`)
        // }
        if(!(await bcrypt.compare(password,user.password))){
            this.logger.debug(`Invalid Credentials`)
            throw new UnauthorizedException();
        }
        return user;
    }
}