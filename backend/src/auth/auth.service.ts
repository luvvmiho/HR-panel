import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hereglegch } from '../user/user.entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(hereglegch)
    private readonly userRepo: Repository<hereglegch>,
  ) {}

  findAll(): Promise<hereglegch[]> {
    return this.userRepo.find();
  }

  async signup(
    ovog: string,
    ner: string,
    gmail: string,
    utas: string,
    nuutsUg: string,
  ): Promise<{ message: string }> {
    const existing = await this.userRepo.findOneBy({ ner });
    if (existing) {
      return { message: 'Хэрэглэгч аль хэдийн бүртгүүлсэн байна' };
    }

    const hashed = await bcrypt.hash(nuutsUg, 10);

    const newUser = this.userRepo.create({
      ovog,
      ner,
      gmail,
      utas,
      nuutsUg: hashed,
      h_role: 'user',
    });

    await this.userRepo.save(newUser);

    return { message: 'Амжилттай бүртгэгдлээ.' };
  }

  async validateUser(
    gmail: string,
    nuutsUg: string,
  ): Promise<hereglegch | null> {
    const user = await this.userRepo.findOneBy({ gmail });
    if (!user) return null;

    const isMatch = await bcrypt.compare(nuutsUg, user.nuutsUg);
    return isMatch ? user : null;
  }

  async findUserById(userId: number): Promise<hereglegch | null> {
    return this.userRepo.findOne({
      where: { h_id: userId },
      select: ['h_id', 'ovog', 'ner', 'gmail', 'utas', 'h_role'], 
    });
  }
}
