import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from './event.entity';

export enum AttendeeAnswerEnum{
    Accepted=1,
    Maybe = 2,
    Rejected = 3
}

@Entity()
export class Attendee{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    name:string
    @ManyToOne(()=>Event,(event)=>event.attendees)
    @JoinColumn()
    event:Event
    @Column('enum',{
        enum:AttendeeAnswerEnum,
        default:AttendeeAnswerEnum.Accepted
    })
    answer:AttendeeAnswerEnum
}