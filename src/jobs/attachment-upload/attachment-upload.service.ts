import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class AttachmentUploadService {
    constructor(private prisma: PrismaService) {}

    async attachFiles(params: {
        files: Express.Multer.File[]
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
        }));

        return this.prisma.attachments.createMany({ data });
    }
}
