import { Injectable } from '@nestjs/common';
import {
  WorkflowRepository,
  WorkflowData,
} from '../../domain/ports/workflow.repository';

@Injectable()
export class ListMerchantWorkflowsUseCase {
  constructor(private workflowRepo: WorkflowRepository) {}

  async execute(merchantId: string): Promise<WorkflowData[]> {
    return this.workflowRepo.findByMerchant(merchantId);
  }
}
