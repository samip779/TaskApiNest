import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
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
    task.user_id = user.id;

    const tasks = await this.taskRepository.find({
      select: {
        id: true,
        order: true,
      },
      where: {
        user_id: Equal(user.id),
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
  findAll(user: User, status: TaskStatus): Promise<Task[]> {
    return this.taskRepository.find({
      where: {
        user_id: user.id,
        status,
      },
    });
  }

  //   This method removes the task with provided id and maintains the order
  async remove(id: number, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id, user_id: user.id },
    });
    if (!task) throw new BadRequestException('You dont have task with that id');

    const tasks = await this.taskRepository.find({
      select: {
        id: true,
        order: true,
      },
      where: {
        order: MoreThan(task.order),
        user_id: Equal(user.id),
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

  // Change order of the task in the same card
  async changeOrder(user: User, id: number, newOrder: number) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (task.user_id !== user.id)
      throw new ForbiddenException('You dont have a task with that id');

    if (task.order < newOrder) {
      const tasks = await this.taskRepository
        .createQueryBuilder('task')
        .select('task.id, task.order')
        .where('task.user_id = :userId', { userId: task.user_id })
        .andWhere('task.status = :status', { status: task.status })
        .andWhere('task.order > :currentOrder', { currentOrder: task.order })
        .andWhere('task.order <= :newOrder', { newOrder })
        .execute();

      const updatedTasks = tasks.map((task: Task) => {
        task.order--;
        return task;
      });

      await this.taskRepository.save(updatedTasks);
    }
    if (task.order > newOrder) {
      const tasks = await this.taskRepository
        .createQueryBuilder('task')
        .select('task.id, task.order')
        .where('task.user_id = :userId', { userId: task.user_id })
        .andWhere('task.status = :status', { status: task.status })
        .andWhere('task.order < :currentOrder', { currentOrder: task.order })
        .andWhere('task.order >= :newOrder', { newOrder })
        .execute();

      const updatedTasks = tasks.map((task: Task) => {
        task.order++;
        return task;
      });

      await this.taskRepository.save(updatedTasks);
    }
    task.order = newOrder;
    await this.taskRepository.save(task);
    return { message: 'Order changed successfully' };
  }

  // This method change the status and order of the task
  async changeStatus(
    user: User,
    id: number,
    newStatus: TaskStatus,
    newOrder: number,
  ) {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (task.user_id !== user.id)
      throw new ForbiddenException('You dont have a task with that id');

    const initialStatusTasks = await this.taskRepository.find({
      select: {
        id: true,
        order: true,
      },
      where: {
        user_id: Equal(task.user_id),
        status: Equal(task.status),
        order: MoreThan(task.order),
      },
    });

    const updatedInitialStatusTasks = initialStatusTasks.map((task) => {
      task.order--;
      return task;
    });

    const initialNewStatusTasks = await this.taskRepository.find({
      select: {
        id: true,
        order: true,
      },
      where: {
        user_id: Equal(task.user_id),
        status: Equal(newStatus),
        order: MoreThanOrEqual(newOrder),
      },
    });

    const updatedInitialNewStatusTask = initialNewStatusTasks.map((task) => {
      task.order++;
      return task;
    });

    task.status = newStatus;
    task.order = newOrder;

    await this.taskRepository.save(updatedInitialStatusTasks);
    await this.taskRepository.save(updatedInitialNewStatusTask);
    await this.taskRepository.save(task);

    return { message: 'task status and order changed' };
  }

  validateStatusQuery(status: TaskStatus) {
    const isValid =
      status === 'todo' ||
      status === 'inprogress' ||
      status === 'testing' ||
      status === 'done' ||
      status === undefined;

    return isValid;
  }
}
