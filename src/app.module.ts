import { Event } from './events/event.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { SchoolModule } from './school/school.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[ormConfig],
      expandVariables: true
    }),
    TypeOrmModule.forRootAsync(
    {
      //Use dynamic expression to choose which file to use
      useFactory: process.env.NODE_ENV!=='production'
      ?ormConfig
      :ormConfigProd
    }
  ),
//Tell the nest that our repository for a specific entity is avaliable
EventsModule,
SchoolModule,
AuthModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
