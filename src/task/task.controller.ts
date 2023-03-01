import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('task')
export class TaskController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req: Request) {
    return { user: req.user };
  }
}
