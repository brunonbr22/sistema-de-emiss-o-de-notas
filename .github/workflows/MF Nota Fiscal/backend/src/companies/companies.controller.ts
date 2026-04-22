import {
  Body, Controller, Get, Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CnpjService } from './cnpj/cnpj.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companies: CompaniesService,
    private readonly cnpj: CnpjService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra uma nova empresa para o usuário' })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCompanyDto) {
    return this.companies.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as empresas do usuário' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.companies.findAllForUser(user.id);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Consulta dados de um CNPJ na Receita Federal' })
  lookupCnpj(@Param('cnpj') cnpj: string) {
    return this.cnpj.lookup(cnpj);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma empresa específica' })
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.companies.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza dados da empresa' })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companies.update(id, user.id, dto);
  }
}
