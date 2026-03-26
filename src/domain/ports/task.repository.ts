export interface TaskData {
  id: string;
  merchantId: string;
  workflowId: string;
  type: string;
  data?: unknown;
  createdAt: Date;
}

export abstract class TaskRepository {
  abstract findByMerchant(merchantId: string): Promise<TaskData[]>;
}
