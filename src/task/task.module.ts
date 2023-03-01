import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [],
})
export class TaskModule {}
