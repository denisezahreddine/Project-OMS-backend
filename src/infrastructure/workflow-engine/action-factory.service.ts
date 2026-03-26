import { Injectable } from '@nestjs/common';
import { ActionHandler } from '../../domain/ports/action-handler.port';
import { NotifyAdminHandler } from './handlers/notify-admin.handler';
import { NotifyUserHandler } from './handlers/notify-user.handler';
import { CreateLogHandler } from './handlers/create-log.handler';
import { CreateTaskHandler } from './handlers/create-task.handler';

@Injectable()
export class ActionFactory {
  getHandler(actionType: string): ActionHandler {
    switch (actionType) {
      case 'notify_admin':
        return new NotifyAdminHandler();

      case 'notify_user':
        return new NotifyUserHandler();

      case 'create_log':
        return new CreateLogHandler();

      case 'create_task':
        return new CreateTaskHandler();

      default:
        throw new Error(`Action inconnue: ${actionType}`);
    }
  }
}
