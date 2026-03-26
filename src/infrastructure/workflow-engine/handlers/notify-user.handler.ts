import { Injectable, Logger } from '@nestjs/common';
import {
  ActionHandler,
  ActionContext,
  ActionResult,
} from '../../../domain/ports/action-handler.port';

@Injectable()
export class NotifyUserHandler implements ActionHandler {
  private readonly logger = new Logger(NotifyUserHandler.name);

  async execute(context: ActionContext): Promise<ActionResult> {
    this.logger.log(
      `Utilisateur notifie — merchant: ${context.merchantId} — data: ${JSON.stringify(context.eventData)}`,
    );
    return {
      success: true,
      message: `Utilisateur notifie — merchant: ${context.merchantId} — data: ${JSON.stringify(context.eventData)}`,
    };
  }
}
