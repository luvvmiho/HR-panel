import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { hereglegch } from './user.entity/user.entity'; 


@Module({
  imports: [TypeOrmModule.forFeature([hereglegch])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService] })
export class UserModule {}
