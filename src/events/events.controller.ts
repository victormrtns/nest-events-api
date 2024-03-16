import {Event} from './event.entity'
import {Controller,Get,Post,Patch,Delete, Param,Body,HttpCode, ParseIntPipe, ValidationPipe,Query, Logger, NotFoundException, UsePipes, UseGuards, ForbiddenException} from "@nestjs/common"
import { CreateEventDto } from "./input/create-event.dto";
import { UpdateEventDto } from "./input/update-event.dto";
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
@Controller('/events')
export class EventsController{
    private readonly logger = new Logger(EventsController.name)
    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>,
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>,
        private readonly eventsService: EventsService
    ){}
    @Get()
    @UsePipes(new ValidationPipe({transform:true}))
    async findAll(@Query() filter:ListEvents){
        const events = await this.eventsService
        .getEventsWithAttendeeCountFilteredPaginated(
            filter,
            {
            total:true,
            currentPage:filter.page,
            limit:10
            }
        );
        return events;
    }
    @Get('/practice')
    async practice(){
        return await this.repository.find({
            where: {id :MoreThan(3)}
        });
    }

    @Get('/practice2')
    async practice2(){
        // // return await this.repository.findOne({where:{id:1},relations:['attendees']})
        // const event = await this.repository.findOne({where:{id:1},relations:['attendees']})
        // const attendee =  new Attendee()
        // attendee.name = 'Using cascade';
        // //U dont have more to associate this flag event to the event, because the cascade is
        // //set to true
        // // attendee.event = event;

        // event.attendees.push(attendee)
        // await this.repository.save(event)
        // return event

        return await this.repository.createQueryBuilder('e')
        .select(['e.id','e.name','e.description'])
        .orderBy('e.id','ASC')
        .take(3)
        .getMany()
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id:number){
        // console.log(typeof id)
        // const event = await this.repository.findOne({where:{id:id}});
        // if(!event){
        //     throw new NotFoundException();
        // }
        // return event

        const event = await this.eventsService.getEvent(id);
        if(!event){
            throw new NotFoundException();
        }
        return event;
    }

    // @Get(':id')
    // findOne(@Param() params: any): string {
    // console.log(params.id);
    // return `This action returns a #${params.id} cat`;
    // }

    @Post()
    @UseGuards(AuthGuardJwt)
    async create(@Body() input:CreateEventDto, @CurrentUser() user:User){ 
        // console.log(user)
        return await this.eventsService.createEvent(input,user)
    }
    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    async update(@Param('id') id,@Body() input:UpdateEventDto,@CurrentUser() user:User){
        const event = await this.repository.findOne({ where: { id:id } })
        if(!event){
            throw new NotFoundException();
        }
        
        if(event.organizerId !== user.id){
            throw new ForbiddenException(
                null,`You are not authorized to change this event.`
            );
        }

        await this.repository.save({
            ...event,
            ...input,
            when:input.when ?
            new Date(input.when) : event.when
        });
    }
    @Delete(':id')
    @UseGuards(AuthGuardJwt)
    @HttpCode(204)
    async remove(@Param('id') id, @CurrentUser() user:User){
        //Wrong because u are removing the id, not the event
        // await this.repository.remove(id)
        // const event = await this.repository.findOne({ where: { id:id } })
        const result = await this.eventsService.deleteEvent(id,user);
        if(result?.affected !==1){
            throw new NotFoundException();
        }
    }
}