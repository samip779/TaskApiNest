import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards';
import { User } from 'src/user/user.entity';
import { CreateTaskDto } from './dto';
import { TaskService } from './task.service';

@UseGuards(JwtGuard)
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Get()
  findAll(@GetUser() user: User) {
    return this.taskService.findAll(user);
  }

  @Post()
  create(@GetUser() user: User, @Body() dto: CreateTaskDto) {
    return this.taskService.create(dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.remove(+id, user);
  }
}
