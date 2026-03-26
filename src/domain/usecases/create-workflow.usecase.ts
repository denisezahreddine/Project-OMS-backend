import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import {
  WorkflowRepository,
  WorkflowData,
  WorkflowCondition,
} from '../../domain/ports/workflow.repository';
import { WorkflowEntity } from '../../domain/models/workflow.entity';

@Injectable()
export class CreateWorkflowUseCase {
  constructor(private workflowRepo: WorkflowRepository) {}

  async execute(
    name: string,
    trigger: string,
    merchantId: string,
    condition?: WorkflowCondition,
  ): Promise<WorkflowData> {
    const workflow = WorkflowEntity.create(
      randomUUID(),
      name,
      trigger,
      merchantId,
    );

    return this.workflowRepo.create({
      id: workflow.id,
      name: workflow.name,
      trigger: workflow.trigger,
      merchantId: workflow.merchantId,
      condition,
    });
  }
}
