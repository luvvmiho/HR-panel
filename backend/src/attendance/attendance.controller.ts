import { Controller, Get, Patch, Param, Query, Body, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {} 

  @Get()
  getByDate(@Query('date') date: string) {
    return this.attendanceService.findByDate(date);
  }
  @Get('/user/:id/report')
    async getUserReport(@Param('id') id: number) {
      return this.attendanceService.getUserReport(id);
    }


  @Patch(':id/checkin')
  checkIn(@Param('id') id: number) {
    return this.attendanceService.checkIn(+id);
  }

  @Patch(':id/checkout')
  checkOut(@Param('id') id: number) {
    return this.attendanceService.checkOut(+id);
  }

  @Patch(':id/edit')
  async editTime(
    @Param('id') id: number,
    @Body() body: { checkInTime: string; checkOutTime: string }
  ) {
    return this.attendanceService.editTime(+id, body.checkInTime, body.checkOutTime); 
  }
  @Post('/create')
  async createAttendance(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }
  @Get('/all')
  getAllAttendance() {
    return this.attendanceService.findAll();
  }

}
