import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RegisterUseCase } from '../application/usecases/register.usecase';

@Controller('auth')
export class AuthController {
  constructor(private registerUseCase: RegisterUseCase) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.registerUseCase.execute(
      dto.email,
      dto.name,
      dto.password,
    );

    return {
      message: 'User created successfully',
      userId: user.id,
    };
  }
}
