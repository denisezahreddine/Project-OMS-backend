export interface ActionContext {
  merchantId?: string;
  workflowId?: string;
  eventData: unknown;
}
export interface ActionResult {
  success: boolean;
  message: string;
}

export interface ActionHandler {
  execute(context: ActionContext): Promise<ActionResult>;
}
