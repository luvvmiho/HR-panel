import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { hereglegch } from '../user/user.entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([hereglegch])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

