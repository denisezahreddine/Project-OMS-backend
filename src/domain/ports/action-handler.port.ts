export interface ActionContext {
  merchantId?: string;
  eventData: unknown;
}

export interface ActionHandler {
  execute(context: ActionContext): Promise<void>;
}
