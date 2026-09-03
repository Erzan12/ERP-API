import { Controller, Param, ParseUUIDPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ErCaseAttachmentService } from './er-case-attachment.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags('Attachment/Documents Upload - Employee Relations')
@Controller('er-case-attachment')
export class ErCaseAttachmentController {
    constructor (private readonly erCaseAttachmentService: ErCaseAttachmentService) {}

    @Post(':disciplinaryCaseId/uploads')
    @UseInterceptors(
        FilesInterceptor('files', 5, {
            storage: memoryStorage(),
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
                    nullable: true,
                },
            },
        },
    })
    @ApiOperation({ summary: 'Upload Attachments for ER Case.' })
    @ApiPostResponse('Attachment uploaded successfully')
    uploadErCaseAttachment(
        @Param('disciplinaryCaseId', new ParseUUIDPipe()) disciplinaryCaseId: string,
        @SessionUser() user: RequestUser,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.erCaseAttachmentService.uploadErCaseDocs(disciplinaryCaseId, user, files);
    }
}
