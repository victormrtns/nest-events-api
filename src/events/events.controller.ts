import {Event} from './event.entity'
import {Controller,Get,Post,Patch,Delete, Param,Body,HttpCode, ParseIntPipe, ValidationPipe,Query, Logger, NotFoundException, UsePipes} from "@nestjs/common"
import { CreateEventDto } from "./input/create-event.dto";
import { UpdateEventDto } from "./input/update-event.dto";
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
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
    async create(@Body() input:CreateEventDto){    
        return await this.repository.save( {
            ...input,
            // when:Date -> Wrong
            when:new Date(input.when),
            //ID now is auto generated
            // id:this.events.length + 1
        });
    }
    @Patch(':id')
    async update(@Param('id') id,@Body() input:UpdateEventDto){
        const event = await this.repository.findOne({ where: { id:id } })
        if(!event){
            throw new NotFoundException();
        }
        await this.repository.save({
            ...event,
            ...input,
            when:input.when ?
            new Date(input.when) : event.when
        });
    }
    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id){
        //Wrong because u are removing the id, not the event
        // await this.repository.remove(id)
        // const event = await this.repository.findOne({ where: { id:id } })
        const result = await this.eventsService.deleteEvent(id);
        if(result?.affected !==1){
            throw new NotFoundException();
        }
    }
}