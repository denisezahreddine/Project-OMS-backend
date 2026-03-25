import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterUseCase } from '../../domain/usecases/register.usecase';
import { LoginUseCase } from '../../domain/usecases/login.usecase';
import { Role } from '../../domain/models/merchant.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.registerUseCase.execute(
      dto.email,
      dto.name,
      dto.password,
      dto.role as Role,
    );
    return {
      message: 'User created successfully',
      userId: user.id,
      role: user.role,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.email, dto.password);
  }
}
