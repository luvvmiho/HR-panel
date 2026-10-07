import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { hereglegch } from 'src/user/user.entity/user.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => hereglegch, (user) => user.attendances, { eager: true, onDelete: 'CASCADE' })
  user: hereglegch;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'datetime', nullable: true })
  checkInTime: Date | null;

  @Column({ type: 'datetime', nullable: true })
  checkOutTime: Date | null;
}
