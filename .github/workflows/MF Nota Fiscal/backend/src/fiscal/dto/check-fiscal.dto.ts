import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal, IsNotEmpty, IsOptional, IsString, Matches,
} from 'class-validator';

export class CheckFiscalDto {
  @ApiProperty({ example: '6201-5/01', description: 'Código CNAE da atividade a ser faturada' })
  @IsString()
  @IsNotEmpty()
  cnaeCode: string;

  @ApiProperty({ example: '500.00', description: 'Valor bruto da nota a ser emitida' })
  @IsDecimal({ decimal_digits: '0,2' })
  grossValue: string;

  @ApiPropertyOptional({ example: '3550308', description: 'Código IBGE do município do tomador (para NFS-e)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{7}$/, { message: 'ibgeCode deve ter 7 dígitos numéricos' })
  ibgeCode?: string;
}
