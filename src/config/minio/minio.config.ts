import * as Minio from 'minio';
import * as dotenv from 'dotenv';

dotenv.config();

const useSSL = process.env.MINIO_USE_SSL === 'true';
const port = parseInt(process.env.MINIO_PORT || '443', 10);
const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL || '';

console.log('MinIO config:', {
  endpoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT,
  ssl: process.env.MINIO_USE_SSL,
  bucket: process.env.MINIO_BUCKET,
});

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  region: process.env.MINIO_REGION,
  port,
  useSSL,
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
});

// Bucket names hardcoded here — not secrets, no need for .env
export const MINIO_BUCKETS = {
  AVATARS: 'user-management',
  DOCUMENTS: 'hris',
  PAYSLIPS: 'payslips',
} as const;

export const buildFileUrl = (bucket: string, fileName: string) =>
  `${MINIO_PUBLIC_URL}/${bucket}/${fileName}`;
