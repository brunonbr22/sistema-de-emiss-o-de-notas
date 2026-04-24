import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TakerAddressDto {
  @ApiPropertyOptional() @IsOptional() @IsString() logradouro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() numero?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bairro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() municipio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() uf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cep?: string;
}

export class EmitNfeDto {
  @ApiProperty({ description: 'CNPJ ou CPF do tomador (somente números)' })
  @IsString()
  @IsNotEmpty()
  takerDocument: string;

  @ApiProperty({ description: 'Razão social ou nome do tomador' })
  @IsString()
  @IsNotEmpty()
  takerName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  takerEmail?: string;

  @ApiProperty({ description: 'Descrição do produto/mercadoria' })
  @IsString()
  @IsNotEmpty()
  serviceDesc: string;

  @ApiProperty({ description: 'CFOP da operação (ex: 5102, 5933)', example: '5102' })
  @IsString()
  @Length(4, 4)
  cfop: string;

  @ApiProperty({ description: 'Valor bruto em reais', example: 500.0 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  grossValue: number;

  @ApiProperty({ description: 'CNAE do emissor', example: '4751-2/01' })
  @IsString()
  @IsNotEmpty()
  cnaeCode: string;

  @ApiPropertyOptional({ description: 'Natureza da operação', example: 'Venda de mercadoria' })
  @IsOptional()
  @IsString()
  naturezaOperacao?: string;

  @ApiPropertyOptional({ description: 'Informações adicionais para o fisco' })
  @IsOptional()
  @IsString()
  informacoesAdicionais?: string;

  @ApiPropertyOptional({ type: TakerAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TakerAddressDto)
  takerAddress?: TakerAddressDto;
}
