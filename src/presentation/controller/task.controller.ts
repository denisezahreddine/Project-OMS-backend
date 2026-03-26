import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetTasksUseCase } from '../../domain/usecases/get-tasks.usecase';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly getTasksUseCase: GetTasksUseCase) {}

  @Get()
  async findAll(@Request() req) {
    return this.getTasksUseCase.execute(req.user.id);
  }
}
