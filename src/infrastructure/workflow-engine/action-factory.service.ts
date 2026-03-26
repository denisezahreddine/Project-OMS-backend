import { Injectable } from '@nestjs/common';
import { ActionHandler } from '../../domain/ports/action-handler.port';
import { NotifyAdminHandler } from './handlers/notify-admin.handler';
import { NotifyUserHandler } from './handlers/notify-user.handler';
import { CreateLogHandler } from './handlers/create-log.handler';
import { CreateTaskHandler } from './handlers/create-task.handler';

@Injectable()
export class ActionFactory {
  constructor(
    private readonly notifyAdmin: NotifyAdminHandler,
    private readonly notifyUser: NotifyUserHandler,
    private readonly createLog: CreateLogHandler,
    private readonly createTask: CreateTaskHandler,
  ) {}

  getHandler(actionType: string): ActionHandler {
    switch (actionType) {
      case 'notify_admin':  return this.notifyAdmin;
      case 'notify_user':   return this.notifyUser;
      case 'create_log':    return this.createLog;
      case 'create_task':   return this.createTask;
      default:
        throw new Error(`Action inconnue: ${actionType}`);
    }
  }
}
