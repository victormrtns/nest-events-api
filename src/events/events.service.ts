import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { Attendee, AttendeeAnswerEnum } from './attendee.entity';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { PaginateOptions,paginate } from 'src/pagination/paginator';
import { CreateEventDto } from './input/create-event.dto';
import { User } from 'src/auth/user.entity';
import {Event} from './event.entity'

@Injectable()
export class EventsService{
    private readonly logger = new Logger(EventsService.name)
    constructor(
        @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>
    ){}
    private getEventsBaseQuery(){
        return this.eventsRepository
        .createQueryBuilder('e')
        .orderBy('e.id','ASC')
    }
    public async createEvent(input:CreateEventDto,user:User):Promise<Event>
    {
        //No overload error is a bug that u should pass all the parameters
        return await this.eventsRepository.save( {
            ...input,
            organizer:user,
            // when:Date -> Wrong
            when:new Date(input.when),
            //ID now is auto generated
            // id:this.events.length + 1
        });
    }

    public getEventsWithAttendeeCountQuery(){
        return this.getEventsBaseQuery()
        .loadRelationCountAndMap(
            'e.attendeeCount','e.attendees'
        )
        .loadRelationCountAndMap(
            'e.attendeeAccepted',
            'e.attendees',
            'attendee',
            (qb) => qb
                .where(
                    'attendee.answer = :answer',{answer:AttendeeAnswerEnum.Accepted}
                )
        )
        .loadRelationCountAndMap(
            'e.attendeeMaybe',
            'e.attendees',
            'attendee',
            (qb) => qb
                .where(
                    'attendee.answer = :answer',{answer:AttendeeAnswerEnum.Maybe}
                )
        )
        .loadRelationCountAndMap(
            'e.attendeeRejected',
            'e.attendees',
            'attendee',
            (qb) => qb
                .where(
                    'attendee.answer = :answer',{answer:AttendeeAnswerEnum.Rejected}
                )
        )
    }

    public async deleteEvent(id:number):Promise<DeleteResult>{
        return await this.eventsRepository.createQueryBuilder('e')
        .delete()
        .where('id =:id',{id})
        .execute();
    }

    private async getEventsWithAttendeeCountFiltered(filter?:ListEvents){
        let query = this.getEventsWithAttendeeCountQuery();
        if(!filter){
            return query;
        }
        if(filter.when){
            if(filter.when == WhenEventFilter.Today){
                query = query.andWhere(
                    `e.when>= CURDATE() AND e.when<=CURDATE()+ INTERVAL 1 DAY`
                )
            }
            if(filter.when == WhenEventFilter.Tommorow){
                query = query.andWhere(
                    `e.when>= CURDATE() + INTERVAL 1 DAY AND e.when<=CURDATE() + INTERVAL 2 DAY`
                )
            }
            if(filter.when == WhenEventFilter.ThisWeek){
                query = query.andWhere(
                    'YEARWEEK(e.when,1) = YEARWEEK(CURDATE(),1)'
                )
            }
            if(filter.when == WhenEventFilter.NextWeek){
                query = query.andWhere(
                    'YEARWEEK(e.when,1) = YEARWEEK(CURDATE(),1) + 1'
                )
            }
            return await query
        }
    }
    public async getEventsWithAttendeeCountFilteredPaginated(
        filter:ListEvents,
        paginateOptions:PaginateOptions

    ){
        return await paginate(
            await this.getEventsWithAttendeeCountFiltered(filter),
            paginateOptions
        );
    }

    public async getEvent(id:number): Promise<Event>|undefined{
        const query = await this.getEventsWithAttendeeCountQuery()
        .andWhere('e.id = :id',{id})
        this.logger.debug(query.getSql())
        return query.getOne();
    }
}