import { Injectable, Logger } from '@nestjs/common';
import {
  ActionHandler,
  ActionContext,
} from '../../../domain/ports/action-handler.port';

@Injectable()
export class NotifyUserHandler implements ActionHandler {
  private readonly logger = new Logger(NotifyUserHandler.name);

  execute(context: ActionContext): Promise<void> {
    this.logger.log(
      `Utilisateur notifie — merchant: ${context.merchantId} — data: ${JSON.stringify(context.eventData)}`,
    );
    return Promise.resolve();
  }
}
