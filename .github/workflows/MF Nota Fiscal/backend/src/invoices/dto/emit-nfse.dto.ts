import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class NfseTakerAddressDto {
  @ApiPropertyOptional() @IsOptional() @IsString() logradouro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() numero?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() complemento?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bairro?: string;
  @ApiPropertyOptional({ description: 'Código IBGE do município do tomador (7 dígitos)' })
  @IsOptional() @IsString() @Matches(/^\d{7}$/)
  codigoMunicipio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(2, 2) uf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cep?: string;
}

export class EmitNfseDto {
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

  @ApiProperty({ description: 'Descrição do serviço prestado' })
  @IsString()
  @IsNotEmpty()
  serviceDesc: string;

  @ApiProperty({ description: 'Código IBGE do município do prestador (7 dígitos)', example: '3550308' })
  @IsString()
  @Matches(/^\d{7}$/, { message: 'ibgeCode deve ter 7 dígitos numéricos' })
  ibgeCode: string;

  @ApiProperty({ description: 'CNAE da atividade', example: '6201-5/01' })
  @IsString()
  @IsNotEmpty()
  cnaeCode: string;

  @ApiProperty({ description: 'Valor bruto do serviço em reais', example: 500.0 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  grossValue: number;

  @ApiPropertyOptional({
    description: 'Código do item da lista de serviços do município (ex: 01.01)',
    example: '01.01',
  })
  @IsOptional()
  @IsString()
  itemListaServico?: string;

  @ApiPropertyOptional({ description: 'Código de tributação do município' })
  @IsOptional()
  @IsString()
  codigoTributacaoMunicipio?: string;

  @ApiPropertyOptional({ description: 'Informações adicionais para o fisco' })
  @IsOptional()
  @IsString()
  informacoesAdicionais?: string;

  @ApiPropertyOptional({ type: NfseTakerAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => NfseTakerAddressDto)
  takerAddress?: NfseTakerAddressDto;
}
