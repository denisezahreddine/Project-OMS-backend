import { Injectable, Logger } from '@nestjs/common';
import {
  ActionHandler,
  ActionContext,
} from '../../../domain/ports/action-handler.port';

@Injectable()
export class NotifyAdminHandler implements ActionHandler {
  private readonly logger = new Logger(NotifyAdminHandler.name);

  execute(context: ActionContext): Promise<void> {
    this.logger.log(
      `Admin notifie — merchant: ${context.merchantId} — data: ${JSON.stringify(context.eventData)}`,
    );
    return Promise.resolve();
  }
}
