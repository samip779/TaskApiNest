import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards';

@Controller('task')
export class TaskController {
  @UseGuards(JwtGuard)
  @Get()
  findAll(@Req() req: Request) {
    return { user: req.user };
  }
}
