import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { buildFileUrl, MINIO_BUCKETS, minioClient } from '../../config/prisma/minio/minio.config';
import { Prisma } from '@prisma/client';

@Injectable()
export class AttachmentUploadService {
    constructor(private prisma: PrismaService) {}

    // async attachFiles(
    //     params: {
    //         files: Express.Multer.File[];
    //         transaction_type: string;
    //         transaction_id: string;
    //         document_types?: string[];
    //         user_id?: string;
    //     },
    //     tx?: Prisma.TransactionClient,
    // ) {
    //     const prisma = tx || this.prisma;

    //     const { files, transaction_type, transaction_id, document_types, user_id } = params;

    //     if (document_types && files.length !== document_types.length) {
    //     throw new BadRequestException('Files and document types count must match');
    //     }

    //     const bucket = MINIO_BUCKETS.DOCUMENTS;

    //     const extension =
    //         files.originalname.split('.').pop()?.toLowerCase() || 'jpg';

    //     const fileName = `avatars/${randomUUID()}.${extension}`;

    //     await minioClient.putObject(
    //         bucket,
    //         fileName,
    //         file.buffer,
    //         file.size,
    //         {
    //             'Content-Type': file.mimetype,
    //         }
    //     )

    //     const data = files.map((file, i) => ({
    //         transaction_type,
    //         transaction_id,
    //         file_name: file.filename,
    //         file_path: `uploads/${file.filename}`,
    //         mime_type: file.mimetype,
    //         file_size: file.size,
    //         // file_desc: 
    //         created_by: user_id,
    //         })
    //     );

    //     return this.prisma.attachments.createMany({ data });
    // }

    async attachFiles(
        params: {
            files: Express.Multer.File[];
            transaction_type: string;
            transaction_id: string;
            document_types?: string[];
            user_id?: string;
        },
        tx?: Prisma.TransactionClient,
    ) {
        const prisma = tx || this.prisma;
        const { files, transaction_type, transaction_id, document_types, user_id } = params;

        if (document_types && files.length !== document_types.length) {
            throw new BadRequestException('Files and document types count must match');
        }

        const bucket = MINIO_BUCKETS.DOCUMENTS;

        // Upload each file to MinIO and build attachment records
        const data = await Promise.all(
            files.map(async (file, i) => {
                // Guard: catch missing buffer early
                if (!file.buffer) {
                    throw new BadRequestException(
                        `File "${file.originalname}" has no buffer. Ensure multer is using memoryStorage.`
                    );
                }

                const extension = file.originalname.split('.').pop()?.toLowerCase() || 'bin';
                const fileName = `applicant-documents/${randomUUID()}.${extension}`;

                await minioClient.putObject(
                    bucket,
                    fileName,
                    file.buffer,
                    file.size,
                    { 'Content-Type': file.mimetype },
                );

                const fileUrl = buildFileUrl(bucket, fileName);

                return {
                    transaction_type,
                    transaction_id,
                    file_name: file.originalname,
                    file_path: fileUrl,
                    mime_type: file.mimetype,
                    file_size: file.size,
                    // document_type: document_types?.[i] ?? null,
                    created_by: user_id,
                };
            })
        );

        return prisma.attachments.createMany({ data });
    }

    // with minion cloud storage
    async avatarUpload(
        params: {
            file: Express.Multer.File;
            transaction_type: string;
            transaction_id: string;
            user_id?: string;
        },
        tx?: Prisma.TransactionClient,
    ) {
        const prisma = tx || this.prisma;
        const { file, transaction_type, transaction_id, user_id } = params;

        console.log('AVATAR UPLOAD PARAMS:', {
            transaction_id,
            transaction_type,
            user_id,
            file_name: file?.originalname,
        });

        if (!file) {
            throw new BadRequestException('No avatar uploaded');
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid image type');
        }

        const bucket = MINIO_BUCKETS.AVATARS;
        const extension = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `avatars/${randomUUID()}.${extension}`;
        const avatarUrl = buildFileUrl(bucket, fileName);

        try {
            // Upload to MinIO
            await minioClient.putObject(
                bucket, 
                fileName, 
                file.buffer, 
                file.size, 
            {
                'Content-Type': file.mimetype,
            });

            // Update the EXISTING user's avatar (not create a new one)
            const user = await prisma.user.update({
                where: { 
                    id: transaction_id 
                },
                data: { 
                    avatar: avatarUrl 
                },
                // select: { 
                //     id: true, 
                //     username: true, 
                //     avatar: true 
                // },
            });

            // Create attachment record
            await prisma.attachments.create({
                data: {
                    transaction_type,
                    transaction_id,
                    file_name: file.originalname,
                    file_path: avatarUrl,
                    mime_type: file.mimetype,
                    file_size: file.size,
                    created_by: user_id,
                },
            });

            return {
                ...user,
                avatar_url: avatarUrl,
            };

        } catch (err: any) {
            console.error('AVATAR UPLOAD ERROR:', {
                message: err?.message,
                code: err?.code,
                meta: err?.meta,
            });
            throw err;
        }
    }
    // async avatarUpload(
    //     params: {
    //         file: Express.Multer.File;
    //         transaction_type: string;
    //         transaction_id: string;
    //         document_type?: string;
    //         user_id?: string;
    //     },
    //     tx?: Prisma.TransactionClient,
    // ) {
    //     const prisma = tx || this.prisma;

    //     const { file, transaction_type, transaction_id, user_id } = params;

    //     if (!file) {
    //         throw new BadRequestException('No avatar uploaded');
    //     }

    //     const allowedMimeTypes = [
    //         'image/jpeg',
    //         'image/png',
    //         'image/webp',
    //     ];

    //     if (!allowedMimeTypes.includes(file.mimetype)) {
    //         throw new BadRequestException('Invalid image type');
    //     }

    //     const bucket = MINIO_BUCKETS.AVATARS;

    //     const extension =
    //         file.originalname.split('.').pop()?.toLowerCase() || 'jpg';

    //     // const fileName =
    //     //     `${transaction_id}/${randomUUID()}.${extension}`;

    //     const fileName = `avatars/${randomUUID()}.${extension}`;

    //     // const avatarUrl =
    //     //     `${process.env.MINIO_PUBLIC_URL}/${bucket}/${fileName}`;

    //     try {
    //         const avatarFileName = `avatars/${randomUUID()}.${file.originalname.split('.').pop()?.toLowerCase() || 'jpg'}`;
    //         const bucket = MINIO_BUCKETS.AVATARS;

    //         await minioClient.putObject(
    //             bucket,
    //             fileName,
    //             file.buffer,
    //             file.size,
    //             {
    //                 'Content-Type': file.mimetype,
    //             },
    //         );

    //         const avatarUrl = buildFileUrl(bucket, avatarFileName);
            
    //         const user = await prisma.user.update({
    //             where: {
    //                 id: transaction_id,
    //             },

    //             data: {
    //                 avatar: buildFileUrl(bucket, fileName),
    //             },

    //             select: {
    //                 id: true,
    //                 username: true,
    //                 avatar: true,
    //             },
    //         });
    //         console.log('USER UPDATED:', user);

    //         await prisma.attachments.create({
    //             data: {
    //                 transaction_type,
    //                 transaction_id,
    //                 file_name: file.originalname,
    //                 file_path: `${avatarUrl}`,
    //                 mime_type: file.mimetype,
    //                 file_size: file.size,
    //                 created_by: user_id,
    //             },
    //         });

    //         console.log('FILE DEBUG:', {
    //             exists: !!file,
    //             buffer: !!file?.buffer,
    //             size: file?.size,
    //             mimetype: file?.mimetype,
    //             originalname: file?.originalname,
    //         });

    //         return {
    //             ...user,
    //             avatar_url: avatarUrl,
    //         };

    //     } catch (err: any) {
    //         // console.error('PRISMA USER UPDATE ERROR:', err);
    //         console.error('PRISMA USER UPDATE ERROR:', {
    //             message: err?.message,
    //             stack: err?.stack,
    //             code: err?.code,
    //             meta: err?.meta,
    //         });
    //         console.error('MINIO ERROR:', err);
    //         throw err;
    //     }
    // }

    // with root directory storage
    // async avatarUpload(params: {
    //     file: Express.Multer.File;
    //     transaction_type: string;
    //     transaction_id: string;
    //     document_type?: string;
    //     user_id?: string;
    //     },
    //     tx?: Prisma.TransactionClient
    // ) {
    //     const { file, transaction_type, transaction_id, user_id } = params;

    //     if (!file) {
    //         throw new BadRequestException('No avatar uploaded');
    //     }

    //     // Determine whether to use the transaction client or standard prisma client
    //     const prismaClient = tx || this.prisma;

    //     // 1. Setup local target path (root/uploads)
    //     const uploadDir = path.join(process.cwd(), 'uploads');
        
    //     // Auto-create 'uploads' folder if it doesn't exist yet
    //     if (!fs.existsSync(uploadDir)) {
    //         fs.mkdirSync(uploadDir, { recursive: true });
    //     }

    //     // 2. Keep filename consistent (handle disk vs memory storage arrays)
    //     const extension = file.originalname.split('.').pop();
    //     const fileName = file.filename || `${randomUUID()}.${extension}`;
    //     const filePath = path.join(uploadDir, fileName);

    //     // write file directly to local disk if buffer exists
    //     if (file.buffer) {
    //         fs.writeFileSync(filePath, file.buffer);
    //     }

    //     // Temporary local testing URL path
    //     const avatarUrl = `/uploads/user/avatars/${fileName}`;

    //     // 4. Update User Profile Table
    //     const user = await prismaClient.user.update({
    //         where: { id: transaction_id },
    //         data: { avatar: fileName },
    //         select: {
    //             id: true,
    //             username: true,
    //             avatar: true,
    //         },
    //     });

    //     // 5. Track record in Attachments Table matching your local schema format
    //     const attachments = await prismaClient.attachments.create({
    //         data: {
    //             transaction_type,
    //             transaction_id,
    //             file_name: file.originalname || fileName,
    //             file_path: `uploads/${avatarUrl}`,
    //             mime_type: file.mimetype,
    //             file_size: file.size,
    //             created_by: user_id,
    //         },
    //     });

    //     return {
    //         ...user,
    //         avatar_url: avatarUrl,
    //         attachments
    //     };
    // }
}
