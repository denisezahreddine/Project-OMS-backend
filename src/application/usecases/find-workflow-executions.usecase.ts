import { Injectable } from '@nestjs/common';
import {
  WorkflowRepository,
  WorkflowExecutionData,
} from '../../domain/ports/workflow.repository';

@Injectable()
export class FindWorkflowExecutionsUseCase {
  constructor(private workflowRepo: WorkflowRepository) {}

  async execute(workflowId: string): Promise<WorkflowExecutionData[]> {
    return this.workflowRepo.findExecutions(workflowId);
  }
}
