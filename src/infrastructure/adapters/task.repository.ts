import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TaskRepository, TaskData } from '../../domain/ports/task.repository';

@Injectable()
export class PrismaTaskRepository extends TaskRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async findByMerchant(merchantId: string): Promise<TaskData[]> {
    return this.prisma.task.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<TaskData[]>;
  }
}
