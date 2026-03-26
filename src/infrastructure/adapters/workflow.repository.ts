import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/mongo/client';
import { PrismaService } from '../database/prisma.service';
import {
  WorkflowRepository,
  WorkflowData,
  WorkflowActionData,
  WorkflowExecutionData,
} from '../../domain/ports/workflow.repository';

@Injectable()
export class PrismaWorkflowRepository extends WorkflowRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<WorkflowData | null> {
    return this.prisma.workflow.findUnique({
      where: { id },
      include: {
        actions: { orderBy: { order: 'asc' } },
        executions: true,
      },
    }) as Promise<WorkflowData | null>;
  }

  async findByTrigger(
    trigger: string,
    merchantId?: string,
  ): Promise<WorkflowData[]> {
    return this.prisma.workflow.findMany({
      where: {
        trigger,
        isActive: true,
        ...(merchantId ? { merchantId } : {}),
      },
      include: {
        actions: { orderBy: { order: 'asc' } },
      },
    }) as Promise<WorkflowData[]>;
  }

  async create(data: {
    id: string;
    name: string;
    trigger: string;
    merchantId: string;
  }): Promise<WorkflowData> {
    return this.prisma.workflow.create({
      data: {
        name: data.name,
        trigger: data.trigger,
        merchantId: data.merchantId,
      },
      include: { actions: true },
    }) as Promise<WorkflowData>;
  }

  async addAction(
    workflowId: string,
    action: {
      id: string;
      type: string;
      order: number;
      config?: Record<string, unknown>;
    },
  ): Promise<WorkflowActionData> {
    return this.prisma.workflowAction.create({
      data: {
        workflowId,
        type: action.type,
        order: action.order,
        config: (action.config ?? undefined) as
          | Prisma.InputJsonValue
          | undefined,
      },
    }) as Promise<WorkflowActionData>;
  }

  async findByMerchant(merchantId: string): Promise<WorkflowData[]> {
    return this.prisma.workflow.findMany({
      where: { merchantId },
      include: {
        actions: { orderBy: { order: 'asc' } },
      },
    }) as Promise<WorkflowData[]>;
  }

  async saveExecution(data: {
    id: string;
    workflowId: string;
    status: string;
    logs: string[];
  }): Promise<WorkflowExecutionData> {
    return this.prisma.workflowExecution.create({
      data: {
        workflowId: data.workflowId,
        status: data.status,
        logs: data.logs,
      },
    }) as Promise<WorkflowExecutionData>;
  }

  async findExecutions(workflowId: string): Promise<WorkflowExecutionData[]> {
    return this.prisma.workflowExecution.findMany({
      where: { workflowId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<WorkflowExecutionData[]>;
  }

  async updateIsActive(id: string, isActive: boolean): Promise<WorkflowData> {
    return this.prisma.workflow.update({
      where: { id },
      data: { isActive },
      include: { actions: { orderBy: { order: 'asc' } } },
    }) as Promise<WorkflowData>;
  }
}
