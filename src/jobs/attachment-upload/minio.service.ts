// import * as Minio from 'minio';

// export const minioClient = new Minio.Client({
//     endPoint: process.env.MINIO_ENDPOINT!,
//     // port: Number(process.env.MINIO_PORT),
//     useSSL: true,
//     accessKey: process.env.MINIO_ACCESS_KEY!,
//     secretKey: process.env.MINIO_SECRET_KEY!,
// });
import * as Minio from 'minio';

export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10), // Ensure this resolves to 9000, NOT 9001
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || '',
});