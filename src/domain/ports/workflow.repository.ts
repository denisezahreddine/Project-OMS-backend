export interface WorkflowActionData {
  id: string;
  type: string;
  order: number;
  config?: Record<string, unknown> | null;
}

export interface WorkflowData {
  id: string;
  name: string;
  trigger: string;
  isActive: boolean;
  merchantId: string;
  actions: WorkflowActionData[];
}

export interface WorkflowExecutionData {
  id: string;
  workflowId: string;
  status: string;
  logs: string[];
  createdAt: Date;
}

export abstract class WorkflowRepository {
  abstract findById(id: string): Promise<WorkflowData | null>;
  abstract findByTrigger(
    trigger: string,
    merchantId: string,
  ): Promise<WorkflowData[]>;
  abstract create(data: {
    id: string;
    name: string;
    trigger: string;
    merchantId: string;
  }): Promise<WorkflowData>;
  abstract addAction(
    workflowId: string,
    action: {
      id: string;
      type: string;
      order: number;
      config?: Record<string, unknown>;
    },
  ): Promise<WorkflowActionData>;
  abstract findByMerchant(merchantId: string): Promise<WorkflowData[]>;
  abstract saveExecution(data: {
    id: string;
    workflowId: string;
    status: string;
    logs: string[];
  }): Promise<WorkflowExecutionData>;
  abstract findExecutions(workflowId: string): Promise<WorkflowExecutionData[]>;
}
