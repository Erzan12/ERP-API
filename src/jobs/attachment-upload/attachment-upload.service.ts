import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { minioClient } from './minio.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AttachmentUploadService {
    constructor(private prisma: PrismaService) {}

    async attachFiles(params: {
        files: Express.Multer.File[];
        transaction_type: string;
        transaction_id: string;
        document_types?: string[];
        user_id?: string;
    }) {
        const { files, transaction_type, transaction_id, document_types, user_id } = params;

        if (document_types && files.length !== document_types.length) {
        throw new BadRequestException('Files and document types count must match');
        }

        const data = files.map((file, i) => ({
            transaction_type,
            transaction_id,
            file_name: file.filename,
            file_path: `uploads/${file.filename}`,
            mime_type: file.mimetype,
            file_size: file.size,
            // file_desc: 
            created_by: user_id,
            })
        );

        return this.prisma.attachments.createMany({ data });
    }

    // with minion cloud storage
    // async avatarUpload(params: {
    //     file: Express.Multer.File;
    //     transaction_type: string;
    //     transaction_id: string;
    //     document_type?: string;
    //     user_id?: string;
    // }) {
    //     const { file, transaction_type, transaction_id, document_type, user_id } = params;

    //     if (!file) {
    //         throw new BadRequestException('No avatar uploaded');
    //     }

    //     const bucket = process.env.MINIO_BUCKET!;
        
    //     const fileName = `${randomUUID()}-${file.originalname}`;

    //     await minioClient.putObject(
    //         bucket,
    //         fileName,
    //         file.buffer,
    //         file.size,
    //         {
    //             'Content-Type': file.mimetype,
    //         },
    //     );

    //     // public URL
    //     const avatarUrl = `${process.env.MINIO_PUBLIC_URL}/${bucket}/${fileName}`;

    //     const user = await this.prisma.user.update({
    //         where: {
    //             id: transaction_id,
    //         },

    //         data: {
    //             // avatar: avatarUrl,
    //             avatar: fileName
    //         },

    //         select: {
    //             id: true,
    //             username: true,
    //             avatar: true,
    //         },
    //     });

    //     await this.prisma.attachments.create({
    //         data: {
    //             transaction_type,
    //             transaction_id,
    //             file_name: file.originalname,
    //             file_path: avatarUrl,
    //             mime_type: file.mimetype,
    //             file_size: file.size,
    //             created_by: user_id
    //         }
    //     })

    //     return user;
    // }
    // async avatarUpload(params: {
    //     file: Express.Multer.File;
    //     transaction_type: string;
    //     transaction_id: string;
    //     document_type?: string;
    //     user_id?: string;
    //     }) {
    //     const {
    //         file,
    //         transaction_type,
    //         transaction_id,
    //         user_id,
    //     } = params;

    //     if (!file) {
    //         throw new BadRequestException('No avatar uploaded');
    //     }

    //     const bucket = process.env.MINIO_BUCKET!;

    //     const extension = file.originalname.split('.').pop();

    //     const fileName = `${randomUUID()}.${extension}`;

    //     await minioClient.putObject(
    //         bucket,
    //         fileName,
    //         file.buffer,
    //         file.size,
    //         {
    //         'Content-Type': file.mimetype,
    //         },
    //     );

    //     const avatarUrl =
    //         `${process.env.MINIO_PUBLIC_URL}/${bucket}/${fileName}`;

    //     const user = await this.prisma.user.update({
    //         where: {
    //         id: transaction_id,
    //         },

    //         data: {
    //         avatar: fileName,
    //         },

    //         select: {
    //         id: true,
    //         username: true,
    //         avatar: true,
    //         },
    //     });

    //     await this.prisma.attachments.create({
    //         data: {
    //         transaction_type,
    //         transaction_id,
    //         file_name: file.originalname,
    //         file_path: fileName,
    //         mime_type: file.mimetype,
    //         file_size: file.size,
    //         created_by: user_id,
    //         },
    //     });

    //     return {
    //         ...user,
    //         avatar_url: avatarUrl,
    //     };
    // }

    // with root directory storage
    async avatarUpload(params: {
        file: Express.Multer.File;
        transaction_type: string;
        transaction_id: string;
        document_type?: string;
        user_id?: string;
        },
        tx?: Prisma.TransactionClient
    ) {
        const { file, transaction_type, transaction_id, user_id } = params;

        if (!file) {
            throw new BadRequestException('No avatar uploaded');
        }

        // Determine whether to use the transaction client or standard prisma client
        const prismaClient = tx || this.prisma;

        // 1. Setup local target path (root/uploads)
        const uploadDir = path.join(process.cwd(), 'uploads');
        
        // Auto-create 'uploads' folder if it doesn't exist yet
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // 2. Keep filename consistent (handle disk vs memory storage arrays)
        const extension = file.originalname.split('.').pop();
        const fileName = file.filename || `${randomUUID()}.${extension}`;
        const filePath = path.join(uploadDir, fileName);

        // write file directly to local disk if buffer exists
        if (file.buffer) {
            fs.writeFileSync(filePath, file.buffer);
        }

        // Temporary local testing URL path
        const avatarUrl = `/uploads/user/avatars/${fileName}`;

        // 4. Update User Profile Table
        const user = await prismaClient.user.update({
            where: { id: transaction_id },
            data: { avatar: fileName },
            select: {
                id: true,
                username: true,
                avatar: true,
            },
        });

        // 5. Track record in Attachments Table matching your local schema format
        const attachments = await prismaClient.attachments.create({
            data: {
                transaction_type,
                transaction_id,
                file_name: file.originalname || fileName,
                file_path: `uploads/${avatarUrl}`,
                mime_type: file.mimetype,
                file_size: file.size,
                created_by: user_id,
            },
        });

        return {
            ...user,
            avatar_url: avatarUrl,
            attachments
        };
    }
}
