import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'joao@exemplo.com' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty({ example: 'senha_forte_123' })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter ao menos 8 caracteres.' })
  @MaxLength(64)
  password: string;
}
