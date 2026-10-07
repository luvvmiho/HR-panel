import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity/attendance.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { hereglegch } from 'src/user/user.entity/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Attendance, hereglegch])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}


