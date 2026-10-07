
import { Attendance } from 'src/attendance/attendance.entity/attendance.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('hereglegch')
export class hereglegch {
  @PrimaryGeneratedColumn()
  h_id: number;

  @Column({ type: 'varchar', length: 50 })
  ovog: string;

  @Column({ type: 'varchar', length: 50 })
  ner: string;

  @Column({ type: 'varchar', length: 100 })
  gmail: string;

  @Column({ type: 'varchar', length: 8 })
  utas: string;

  @Column({ type: 'varchar', length: 100 })
  nuutsUg: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  h_role: 'admin' | 'user';

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];
}