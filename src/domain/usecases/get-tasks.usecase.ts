import { Injectable } from '@nestjs/common';
import { TaskRepository, TaskData } from '../ports/task.repository';

@Injectable()
export class GetTasksUseCase {
  constructor(private readonly taskRepo: TaskRepository) {}

  async execute(merchantId: string): Promise<TaskData[]> {
    return this.taskRepo.findByMerchant(merchantId);
  }
}
