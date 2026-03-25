// src/infrastructure/adapters/email/nodemailer-notifier.ts
import { Injectable, Logger } from '@nestjs/common';
import {EmailNotifier} from "../../domain/repositories/email.notifier";

@Injectable()
export class EmailNotifierAdapter implements EmailNotifier {
    private readonly logger = new Logger(EmailNotifierAdapter.name);

    async sendOrderNotification(merchantEmail: string, orderId: string): Promise<void> {
        try {
            // Simulation d'envoi d'email
            // Ici, tu intégrerais ton client (SendGrid, Mailgun, ou Nodemailer)
            this.logger.log(`📧 Envoi d'un email à ${merchantEmail} pour la commande #${orderId}`);

            // Exemple fictif :
            // await this.mailService.send({ to: merchantEmail, subject: 'Nouvelle Commande' });

            return Promise.resolve();
        } catch (error) {
            this.logger.error(`❌ Échec de l'envoi d'email à ${merchantEmail}`, error.stack);
            // En archi hexa, on peut choisir de ne pas bloquer la création de commande
            // ou de lever une exception selon l'importance critique du mail.
        }
    }
}