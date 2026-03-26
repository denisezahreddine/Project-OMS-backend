export interface WorkflowActionData {
  id: string;
  type: string;
  order: number;
  config?: Record<string, unknown> | null;
}

export interface WorkflowCondition {
  field: string;
  operator: '>' | '<' | '>=' | '<=' | '===' | '!==';
  value: number | string | boolean;
}

export interface WorkflowData {
  id: string;
  name: string;
  trigger: string;
  isActive: boolean;
  condition?: WorkflowCondition | null;
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
    merchantId?: string,
  ): Promise<WorkflowData[]>;
  abstract create(data: {
    id: string;
    name: string;
    trigger: string;
    merchantId: string;
    condition?: WorkflowCondition;
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
  abstract updateIsActive(id: string, isActive: boolean): Promise<WorkflowData>;
}
