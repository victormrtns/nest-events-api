import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Event } from "./../events/event.entity";
import { Expose } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Expose()
  @Column({unique:true})
  username: string;

  @Column()
  password: string;

  @Expose()
  @Column({unique:true})
  email: string;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(()=>Event,(event)=>event.organizer)
  organized:Event[];
}