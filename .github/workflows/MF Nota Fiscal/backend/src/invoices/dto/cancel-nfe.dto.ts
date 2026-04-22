import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CancelNfeDto {
  @ApiProperty({ description: 'Justificativa do cancelamento (mínimo 15 caracteres)', minLength: 15 })
  @IsString()
  @IsNotEmpty()
  @MinLength(15)
  justificativa: string;
}
