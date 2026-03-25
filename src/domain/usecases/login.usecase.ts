import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MerchantPort } from '../ports/merchant.port';
import { CustomErrorException } from '../exceptions/custom.error.exceptions';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly merchantRepo: MerchantPort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const merchant = await this.merchantRepo.findByEmail(email);

    if (!merchant) {
      throw new CustomErrorException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, merchant.getPassword());

    if (!isValid) {
      throw new CustomErrorException('Invalid credentials');
    }

    const payload = {
      sub: merchant.id,
      email: merchant.email,
      role: merchant.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
