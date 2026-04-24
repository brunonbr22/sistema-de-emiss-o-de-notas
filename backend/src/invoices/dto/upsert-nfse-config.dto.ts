import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpsertNfseConfigDto {
  @ApiProperty({ description: 'Código IBGE do município (7 dígitos)', example: '3550308' })
  @IsString()
  @Matches(/^\d{7}$/, { message: 'ibgeCode deve ter 7 dígitos numéricos' })
  ibgeCode: string;

  @ApiProperty({ description: 'Inscrição municipal do prestador', example: '12345' })
  @IsString()
  @IsNotEmpty()
  inscricaoMunicipal: string;

  @ApiProperty({ description: 'Código do item da lista de serviços do município', example: '01.01' })
  @IsString()
  @IsNotEmpty()
  itemListaServico: string;

  @ApiPropertyOptional({ description: 'Código de tributação do município' })
  @IsOptional()
  @IsString()
  codigoTributacaoMunicipio?: string;
}
