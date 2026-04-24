import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'joao@exemplo.com' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty({ example: 'senha_forte_123' })
  @IsString()
  password: string;
}
