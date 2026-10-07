import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { hereglegch } from './user/user.entity/user.entity';
import { UserModule } from './user/user.module';
import { AttendanceModule } from './attendance/attendance.module';
import { Attendance } from './attendance/attendance.entity/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',       
      password: '12345Az!',
      database: 'dadlaga', 
      entities: [hereglegch, Attendance],  
      synchronize: false,       
    }),
    AuthModule,
    UserModule,
    AttendanceModule
  ],
})
export class AppModule {}
