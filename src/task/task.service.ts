import { BadRequestException, Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, MoreThan, Repository } from 'typeorm';
import { CreateTaskDto } from './dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, user: User) {
    const task: Task = new Task();
    task.name = dto.name;
    task.userId = user.id;

    const tasks = await this.taskRepository.find({
      select: {
        id: true,
        order: true,
      },
      where: {
        userId: Equal(user.id),
        status: Equal(TaskStatus.TODO),
      },
    });

    const updatedTasks = tasks.map((task) => {
      task.order++;
      return task;
    });

    await this.taskRepository.save(updatedTasks);

    return this.taskRepository.save(task);
  }

  //   This method returns all the tasks for a specific user
  findAll(user: User): Promise<Task[]> {
    return this.taskRepository.findBy({ userId: user.id });
  }

  //   This method removes the task with provided id and maintains the order
  async remove(id: number, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) throw new BadRequestException('You dont have task with that id');

    const tasks = await this.taskRepository.find({
      select: {
        id: true,
        order: true,
      },
      where: {
        order: MoreThan(task.order),
        userId: Equal(user.id),
        status: Equal(task.status),
      },
    });

    const updatedTasks = tasks.map((task) => {
      task.order--;
      return task;
    });

    await this.taskRepository.save(updatedTasks);

    await this.taskRepository.delete(id);
    return { message: 'Task deleted successfully' };
  }
}
