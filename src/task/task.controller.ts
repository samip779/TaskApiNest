import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards';
import { User } from 'src/user/user.entity';
import { CreateTaskDto } from './dto';
import { TaskService } from './task.service';
import { TaskStatus } from './task.entity';

@UseGuards(JwtGuard)
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(@GetUser() user: User, @Body() dto: CreateTaskDto) {
    return this.taskService.create(dto, user);
  }

  @Get()
  findAll(@GetUser() user: User, @Query('status') status: TaskStatus) {
    if (!this.taskService.validateStatusQuery(status))
      throw new BadRequestException('invalid query param');

    return this.taskService.findAll(user, status);
  }

  @Put('change-order/:id')
  changeOrder(
    @GetUser() user: User,
    @Query('newOrder') newOrder: number,
    @Param('id') id: number,
  ) {
    if (!newOrder)
      throw new BadRequestException('please provide order  in query');
    return this.taskService.changeOrder(user, id, newOrder);
  }

  @Put('change-status/:id')
  changeStatus(
    @GetUser() user: User,
    @Param('id') id: number,
    @Query('newStatus') newStatus: TaskStatus,
    @Query('newOrder') newOrder: number,
  ) {
    if (!newStatus || !newOrder)
      throw new BadRequestException(
        'please provide new status and new order in query',
      );

    if (!this.taskService.validateStatusQuery(newStatus))
      throw new BadRequestException('invalid query param');

    return this.taskService.changeStatus(user, id, newStatus, newOrder);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.remove(+id, user);
  }
}
