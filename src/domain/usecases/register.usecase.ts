
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MerchantPort } from '../ports/merchant.port';
import { MerchantEntity, Role } from '../models/merchant.entity';
import { CustomErrorException } from '../exceptions/custom.error.exceptions';

@Injectable()
export class RegisterUseCase {
  constructor(
    private merchantRepo: MerchantPort, // UserRepository
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(
    email: string,
    name: string,
    password: string,
    role: Role = Role.MERCHANT,
  ) {
    const existingUser = await this.merchantRepo.findByEmail(email);

    if (existingUser) {
      throw new CustomErrorException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = MerchantEntity.create(
      '',
      name,
      email,
      hashedPassword,
      role,
      new Date(),
      new Date(),
    );

    const saved = await this.merchantRepo.save(user);

    // Émettre l'événement uniquement quand un merchant s'inscrit
    if (role === Role.MERCHANT) {
      this.eventEmitter.emit('user.registered', {
        merchantId: saved.id,
        email: saved.email,
      });
    }

    return saved;
  }
}
