import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Administrator - File Uploads')
@Controller({path: 'administrator', version: '2'})
export class FileUploadController {

    @Post('uploads')
    @UseInterceptors(
    FilesInterceptor('files', 10, {
        storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const ext = extname(file.originalname);
            const name = file.originalname
            .replace(ext, '')
            .replace(/\s+/g, '-');

            cb(null, `${name}-${timestamp}${ext}`);
        },
        }),
    }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
    schema: {
        type: 'object',
        properties: {
        files: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
        },
        },
    },
    })
    uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
        return files.map((file) => ({
            file_name: file.filename,
            file_path: `uploads/${file.filename}`,
        }));
    }
}
