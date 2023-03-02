import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  create(dto: CreateTaskDto, user: User): Promise<Task> {
    const task: Task = new Task();
    task.name = dto.name;
    task.user = user;

    return this.taskRepository.save(task);
  }

  findAll(user: User): Promise<Task[]> {
    return this.taskRepository.findBy({ user });
  }
}
