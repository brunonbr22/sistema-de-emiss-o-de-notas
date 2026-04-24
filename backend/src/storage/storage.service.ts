import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, writeFile, readFile, access } from 'fs/promises';
import { join, dirname } from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly basePath: string;

  constructor(private readonly config: ConfigService) {
    this.basePath = config.get<string>(
      'STORAGE_PATH',
      join(process.cwd(), 'storage'),
    );
  }

  /** Salva buffer em storage e retorna o caminho relativo persistido. */
  async save(relativePath: string, data: Buffer): Promise<string> {
    const fullPath = join(this.basePath, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, data);
    this.logger.debug(`Arquivo salvo: ${relativePath}`);
    return relativePath;
  }

  /** Lê um arquivo do storage. Retorna null se não existir. */
  async get(relativePath: string): Promise<Buffer | null> {
    try {
      return await readFile(join(this.basePath, relativePath));
    } catch {
      return null;
    }
  }

  /** Verifica se um arquivo existe no storage. */
  async exists(relativePath: string): Promise<boolean> {
    try {
      await access(join(this.basePath, relativePath));
      return true;
    } catch {
      return false;
    }
  }

  /** Deriva o caminho do PDF a partir do caminho do XML (mesma base, extensão diferente). */
  pdfPath(xmlPath: string): string {
    return xmlPath.replace(/\.xml$/, '.pdf');
  }

  /** Gera o caminho padrão do XML de uma nota. */
  xmlKey(companyId: string, invoiceId: string, type: 'nfe' | 'nfse'): string {
    return `invoices/${companyId}/${type}-${invoiceId}.xml`;
  }
}
