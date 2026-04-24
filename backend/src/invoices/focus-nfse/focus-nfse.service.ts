import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FocusNfsePayload, FocusNfseResponse } from './focus-nfse.types';

@Injectable()
export class FocusNfseService {
  private readonly logger = new Logger(FocusNfseService.name);

  constructor(private readonly config: ConfigService) {}

  private baseUrl(homologacao: boolean): string {
    return homologacao
      ? 'https://homologacao.focusnfe.com.br/v2'
      : 'https://api.focusnfe.com.br/v2';
  }

  private authHeader(token: string): string {
    return `Basic ${Buffer.from(`${token}:`).toString('base64')}`;
  }

  private async request<T>(
    method: string,
    path: string,
    token: string,
    homologacao: boolean,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl(homologacao)}${path}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: this.authHeader(token),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();

    let data: T;
    try {
      data = JSON.parse(text);
    } catch {
      throw new InternalServerErrorException(
        `Focus NFe (NFS-e) retornou resposta inválida: ${text.slice(0, 200)}`,
      );
    }

    if (!response.ok && response.status !== 422) {
      this.logger.error(`Focus NFS-e [${response.status}] ${path}: ${text.slice(0, 500)}`);
      throw new InternalServerErrorException(
        `Erro na integração Focus NFS-e: ${response.status}`,
      );
    }

    return data;
  }

  emitir(ref: string, payload: FocusNfsePayload, token: string, homologacao = true) {
    return this.request<FocusNfseResponse>(
      'POST',
      `/nfse?ref=${encodeURIComponent(ref)}`,
      token,
      homologacao,
      payload,
    );
  }

  consultar(ref: string, token: string, homologacao = true) {
    return this.request<FocusNfseResponse>(
      'GET',
      `/nfse/${encodeURIComponent(ref)}`,
      token,
      homologacao,
    );
  }

  cancelar(ref: string, justificativa: string, token: string, homologacao = true) {
    return this.request<FocusNfseResponse>(
      'DELETE',
      `/nfse/${encodeURIComponent(ref)}`,
      token,
      homologacao,
      { justificativa },
    );
  }

  async downloadXml(ref: string, token: string, homologacao = true): Promise<Buffer> {
    const url = `${this.baseUrl(homologacao)}/nfse/${encodeURIComponent(ref)}/download_xml`;
    const response = await fetch(url, { headers: { Authorization: this.authHeader(token) } });
    if (!response.ok) throw new InternalServerErrorException('Não foi possível baixar o XML da NFS-e.');
    return Buffer.from(await response.arrayBuffer());
  }

  async downloadPdf(ref: string, token: string, homologacao = true): Promise<Buffer> {
    const url = `${this.baseUrl(homologacao)}/nfse/${encodeURIComponent(ref)}/download_pdf`;
    const response = await fetch(url, { headers: { Authorization: this.authHeader(token) } });
    if (!response.ok) throw new InternalServerErrorException('Não foi possível baixar o PDF da NFS-e.');
    return Buffer.from(await response.arrayBuffer());
  }

  isHomologacao(): boolean {
    return this.config.get<string>('FOCUS_NFE_ENV', 'homologacao') !== 'producao';
  }

  getToken(companyToken?: string | null): string {
    return companyToken ?? this.config.get<string>('FOCUS_NFE_TOKEN', '');
  }
}
