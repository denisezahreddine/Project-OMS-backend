import { CustomErrorException } from '../exceptions/custom.error.exceptions';

export enum Role {
  ADMIN = 'admin',
  MERCHANT = 'merchant',
}

export class MerchantEntity {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string | null,
    public password: string,
    public role: Role,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    name: string | null,
    email: string,
    password: string,
    role: Role = Role.MERCHANT,
    createdAt: Date,
    updatedAt: Date,
  ): MerchantEntity {
    if (!email.includes('@')) {
      throw new CustomErrorException('Invalid email');
    }

    if (password.length < 6) {
      throw new CustomErrorException('Password too short');
    }

    return new MerchantEntity(
      id,
      email,
      name,
      password,
      role,
      createdAt,
      updatedAt,
    );
  }

  getPassword() {
    return this.password;
  }
}
