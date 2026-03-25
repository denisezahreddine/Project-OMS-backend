import { Injectable } from '@nestjs/common';
import { ActionHandler } from '../../domain/ports/action-handler.port';
import { NotifyAdminHandler } from './handlers/notify-admin.handler';
import { NotifyUserHandler } from './handlers/notify-user.handler';
import { CreateLogHandler } from './handlers/create-log.handler';
import { CreateTaskHandler } from './handlers/create-task.handler';

@Injectable()
export class ActionFactory {
  constructor(
    private notifyAdmin: NotifyAdminHandler,
    private notifyUser: NotifyUserHandler,
    private createLog: CreateLogHandler,
    private createTask: CreateTaskHandler,
  ) {}

  getHandler(actionType: string): ActionHandler {
    const handlers: Record<string, ActionHandler> = {
      notify_admin: this.notifyAdmin,
      notify_user: this.notifyUser,
      create_log: this.createLog,
      create_task: this.createTask,
    };

    const handler = handlers[actionType];

    if (!handler) {
      throw new Error(`Action inconnue: ${actionType}`);
    }

    return handler;
  }
}
