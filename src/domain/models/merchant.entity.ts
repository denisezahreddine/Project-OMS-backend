import { CustomErrorException } from '../exceptions/custom.error.exceptions';

export class MerchantEntity {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string | null,
    public password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    name: string | null,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ): MerchantEntity {
    if (!email.includes('@')) {
      throw new CustomErrorException('Invalid email');
    }

    if (password.length < 6) {
      throw new CustomErrorException('Password too short');
    }

    return new MerchantEntity(id, email, name, password, createdAt, updatedAt);
  }

  getPassword() {
    return this.password;
  }
}
