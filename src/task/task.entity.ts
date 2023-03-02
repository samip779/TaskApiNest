import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TaskStatus {
  TODO = 'todo',
  INPROGRESS = 'inprogress',
  TESTING = 'testing',
  DONE = 'done',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  order: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column()
  userId: number;
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'SET NULL' })
  user: User;
}

// @Column()
//   userId: string;
//   @JoinColumn({ name: 'userId' })
//   @ManyToOne(() => User, (user) => user.todos)
//   user: User;
