import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterDtoValidation } from './dto/RegisterDtoValidation';
import { RegisterService } from './register.service';

@Controller('api/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDtoValidation) {
    return this.registerService.registerTenant(registerDto);
  }
}
