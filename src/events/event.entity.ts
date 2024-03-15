import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from './attendee.entity';
import { User } from "src/auth/user.entity";

@Entity()
export class Event{
    // column auto generated identifier
    //turn any field in a primary key
    // @PrimaryColumn()
    //properties that u want to store in the database
    // @Column()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description:string;
    @Column()
    when:Date;
    @Column()
    address:string;
    @OneToMany(()=>Attendee,(attendee) => attendee.event,{
        cascade:true
    })
    attendees:Attendee[]

    attendeeCount?: number;
    
    @ManyToOne(()=> User,(user)=>user.organized)
    @JoinColumn({name:'organizerId'})
    organizer:User
    
    @Column({nullable:true})
    organizerId:number;

    attendeeRejected?: number;
    attendeeMaybe?: number;
    attendeeAccepted?: number;
}