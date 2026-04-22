import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';

// CNPJ não pode ser alterado após o cadastro
export class UpdateCompanyDto extends PartialType(OmitType(CreateCompanyDto, ['cnpj'])) {}
