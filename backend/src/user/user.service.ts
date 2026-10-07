import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hereglegch } from './user.entity/user.entity';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(hereglegch)
    private readonly userRepo: Repository<hereglegch>,
  ) {}

  async findAll(): Promise<hereglegch[]> {
    return this.userRepo.find();
  }

  async findByDate(date: string): Promise<hereglegch[]> {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.attendances', 'attendance')
      .where('attendance.date = :date', { date })
      .getMany();
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }

  async update(id: number, updateDto: UpdateUserDto): Promise<hereglegch | null> {
    await this.userRepo.update(id, updateDto);
    return this.userRepo.findOneBy({ h_id: id });
  }
}