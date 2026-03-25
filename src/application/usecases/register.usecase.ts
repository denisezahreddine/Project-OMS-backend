// application/auth/use-cases/register.usecase.ts
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { MerchantPort } from '../../domain/ports/merchant.port';
import { MerchantEntity } from '../../domain/models/merchant.entity';
import { CustomErrorException } from '../../domain/exceptions/custom.error.exceptions';
@Injectable()
export class RegisterUseCase {
  constructor(
    private merchantRepo: MerchantPort, // UserRepository
  ) {}

  async execute(email: string, name: string, password: string) {
    const existingUser = await this.merchantRepo.findByEmail(email);

    if (existingUser) {
      throw new CustomErrorException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = MerchantEntity.create(
      randomUUID(),
      name,
      email,
      hashedPassword,
      new Date(),
      new Date(),
    );

    return this.merchantRepo.save(user);
  }
}
