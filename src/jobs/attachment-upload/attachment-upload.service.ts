import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { minioClient } from './minio.service';

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

    async avatarUpload(params: {
        file: Express.Multer.File;
        transaction_type: string;
        transaction_id: string;
        document_type?: string;
        user_id?: string;
    }) {
        const { file, transaction_type, transaction_id, document_type, user_id } = params;

        if (!file) {
            throw new BadRequestException('No avatar uploaded');
        }

        const bucket = process.env.MINIO_BUCKET!;
        
        const fileName = `avatars/${randomUUID()}-${file.originalname}`;

        await minioClient.putObject(
            bucket,
            fileName,
            file.buffer,
            file.size,
            {
                'Content-Type': file.mimetype,
            },
        );

        // public URL
        const avatarUrl = `${process.env.MINIO_PUBLIC_URL}/${bucket}/${fileName}`;

        const user = await this.prisma.user.update({
            where: {
                id: user_id,
            },

            data: {
                avatar: avatarUrl,
            },

            select: {
                id: true,
                username: true,
                avatar: true,
            },
        });

        await this.prisma.attachments.create({
            data: {
                transaction_type,
                transaction_id,
                file_name: file.filename,
                file_path: avatarUrl,
                mime_type: file.mimetype,
                file_size: file.size,
                created_by: user_id
            }
        })

        return user;
    }
}
