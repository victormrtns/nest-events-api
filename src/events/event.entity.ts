import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from './attendee.entity';
import { User } from "src/auth/user.entity";
import { Expose } from "class-transformer";

@Entity()
export class Event{
    // column auto generated identifier
    //turn any field in a primary key
    // @PrimaryColumn()
    //properties that u want to store in the database
    // @Column()
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;
    @Column()
    @Expose()
    name: string;
    @Column()
    @Expose()
    description:string;
    @Column()
    @Expose()
    when:Date;
    @Column()
    @Expose()
    address:string;
    @OneToMany(()=>Attendee,(attendee) => attendee.event,{
        cascade:true
    })
    @Expose()
    attendees:Attendee[]

    attendeeCount?: number;
    
    @ManyToOne(()=> User,(user)=>user.organized)
    @JoinColumn({name:'organizerId'})
    @Expose()
    organizer:User
    
    @Column({nullable:true})
    organizerId:number;

    @Expose()
    attendeeRejected?: number;
    @Expose()
    attendeeMaybe?: number;
    @Expose()
    attendeeAccepted?: number;
}