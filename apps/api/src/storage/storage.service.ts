import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly client = new S3Client({
    region: process.env.R2_REGION ?? 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
    },
  });

  async saveXml(key: string, content: string) {
    if (!process.env.R2_BUCKET) {
      return { url: `memory://${key}` };
    }

    await this.client.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: content, ContentType: 'application/xml' }));
    return { url: `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${key}` };
  }
}
