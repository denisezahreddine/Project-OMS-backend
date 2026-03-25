import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import {
  WorkflowRepository,
  WorkflowActionData,
} from '../../domain/ports/workflow.repository';
import { CustomErrorException } from '../../domain/exceptions/custom.error.exceptions';

@Injectable()
export class AddActionToWorkflowUseCase {
  constructor(private workflowRepo: WorkflowRepository) {}

  async execute(
    workflowId: string,
    type: string,
    order: number,
    config?: Record<string, unknown>,
  ): Promise<WorkflowActionData> {
    // Vérifie que le workflow existe
    const workflow = await this.workflowRepo.findById(workflowId);
    if (!workflow) {
      throw new CustomErrorException('Workflow introuvable');
    }

    return this.workflowRepo.addAction(workflowId, {
      id: randomUUID(),
      type,
      order,
      config,
    });
  }
}
