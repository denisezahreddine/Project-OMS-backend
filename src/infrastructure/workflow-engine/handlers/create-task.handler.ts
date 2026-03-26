import { Injectable, Logger } from '@nestjs/common';
import {
  ActionHandler,
  ActionContext,
  ActionResult,
} from '../../../domain/ports/action-handler.port';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/mongo/client';

@Injectable()
export class CreateTaskHandler implements ActionHandler {
  private readonly logger = new Logger(CreateTaskHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(context: ActionContext): Promise<ActionResult> {
    const task = await this.prisma.task.create({
      data: {
        merchantId: context.merchantId ?? '',
        workflowId: (context.eventData as Record<string, string>)?.workflowId ?? '',
        type: 'workflow_task',
        data: context.eventData ? (context.eventData as unknown as Prisma.InputJsonValue) : undefined,
      },
    });

    this.logger.log(`Tache creee en base — id: ${task.id} — merchant: ${context.merchantId}`);
    return {
      success: true,
      message: `Tache creee en base — id: ${task.id}`,
    };
  }
}
