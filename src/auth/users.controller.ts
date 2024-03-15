import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./input/create.user.dto";
import { Repository } from 'typeorm';

@Controller('users')
export class UsersController{
    constructor(
        private readonly authService:AuthService,
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}
    @Post()
    async create(@Body() createUserDto:CreateUserDto){
        const user = new User();
        if(createUserDto.password !== createUserDto.retypedPassword){
            throw new BadRequestException(['The passwords dont match']);
        }
        const existingUser = await this.userRepository.findOne({
            where:[
            {username:createUserDto.username},
            {email:createUserDto.email}
            ]
        })
        if(existingUser){
            throw new BadRequestException(['User is already registered']);
        }
        user.username = createUserDto.username
        user.password = await this.authService.hashPassword(createUserDto.password)
        user.email = createUserDto.email
        user.firstName = createUserDto.firstName
        user.lastName = createUserDto.lastName
        return{
            ...(await this.userRepository.save(user)),
            token: this.authService.getTokenForUser(user)
        }
    }
}