import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity/attendance.entity';
import { hereglegch } from '../user/user.entity/user.entity';
import { CreateAttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @InjectRepository(hereglegch)
    private readonly userRepo: Repository<hereglegch>,
  ) {}

  async getUserReport(userId: number): Promise<Attendance[]> {
    return this.attendanceRepo.find({
      where: { user: { h_id: userId } },
      order: { date: 'DESC' },
      relations: ['user'],
    });
  }

  async findByDate(date: string): Promise<Attendance[]> {
    const users = await this.userRepo.find();
    const records = await this.attendanceRepo.find({
      where: { date },
      relations: ['user'],
    });

    const recordMap = new Map<number, Attendance>();
    records.forEach((record) => recordMap.set(record.user.h_id, record));

    return users.map((user) => {
      const existing = recordMap.get(user.h_id);
      return existing || {
        id: 0,
        user,
        date,
        checkInTime: null,
        checkOutTime: null,
      } as Attendance;
    });
  }

  async create(createDto: CreateAttendanceDto): Promise<Attendance> {
    const user = await this.userRepo.findOne({ where: { h_id: createDto.userHId } });

    if (!user) throw new NotFoundException('User not found');

    const attendance = this.attendanceRepo.create({
      date: createDto.date,
      checkInTime: createDto.checkInTime ? new Date(createDto.checkInTime) : null,
      checkOutTime: createDto.checkOutTime ? new Date(createDto.checkOutTime) : null,
      user,
    });

    return this.attendanceRepo.save(attendance);
  }

  async checkIn(userId: number): Promise<Attendance> {
    const user = await this.userRepo.findOneBy({ h_id: userId });
    if (!user) throw new NotFoundException('User not found');

    const today = new Date().toISOString().split('T')[0];
    let record = await this.attendanceRepo.findOne({
      where: { user: { h_id: userId }, date: today },
      relations: ['user'],
    });

    if (!record) {
      record = this.attendanceRepo.create({ user, date: today });
    }

    record.checkInTime = new Date();
    return this.attendanceRepo.save(record);
  }

  async checkOut(userId: number): Promise<Attendance> {
    const user = await this.userRepo.findOneBy({ h_id: userId });
    if (!user) throw new NotFoundException('User not found');

    const today = new Date().toISOString().split('T')[0];
    let record = await this.attendanceRepo.findOne({
      where: { user: { h_id: userId }, date: today },
      relations: ['user'],
    });

    if (!record) {
      record = this.attendanceRepo.create({ user, date: today });
    }

    record.checkOutTime = new Date();
    return this.attendanceRepo.save(record);
  }

  async editTime(id: number, checkInTime: string, checkOutTime: string): Promise<Attendance> {
    const attendance = await this.attendanceRepo.findOne({ where: { id } });
    if (!attendance) throw new NotFoundException('Attendance not found');

    attendance.checkInTime = checkInTime ? new Date(checkInTime) : null;
    attendance.checkOutTime = checkOutTime ? new Date(checkOutTime) : null;

    return this.attendanceRepo.save(attendance);
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepo.find({
      order: { date: 'DESC' },
      relations: ['user'],
    });
  }
}
