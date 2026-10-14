import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ErCaseAttachmentService } from './er-case-attachment.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags('Attachment/Documents Upload - Employee Relations')
@Controller({ path: 'er-attachment', version: '2' })
export class ErCaseAttachmentController {
  constructor(
    private readonly erCaseAttachmentService: ErCaseAttachmentService,
  ) {}

  @Put('er-case/:disciplinaryCaseId/uploads')
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
    @Param('disciplinaryCaseId', ParseUUIDPipe)
    disciplinaryCaseId: string,
    @SessionUser() user: RequestUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.erCaseAttachmentService.uploadErCaseDocs(
      disciplinaryCaseId,
      user,
      files,
    );
  }

  @Delete('er-case/:disciplinaryCaseId/documents/:attachmentId')
  @ApiOperation({
    summary: 'Disciplinary Case Attachment deleted successfully.',
  })
  async deleteErCaseDoc(
    @Param('disciplinaryCaseId', ParseUUIDPipe) disciplinaryCaseId: string,
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.erCaseAttachmentService.deleteErCaseDoc(
      disciplinaryCaseId,
      attachmentId,
      user,
    );
  }

  @Put('ir-er/:reportId/uploads')
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
  @ApiOperation({
    summary: 'Upload Attachments for Incident or Employee Report',
  })
  @ApiPostResponse('Attachment uploaded successfully')
  uploadIrErAttachment(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @SessionUser() user: RequestUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.erCaseAttachmentService.uploadIrErDocs(reportId, user, files);
  }

  @Put('nte/:nteId/uploads')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload or Update Attachment for an NTE',
  })
  @ApiPostResponse('Attachment uploaded successfully')
  uploadNteDoc(
    @Param('nteId', ParseUUIDPipe) nteId: string,
    @SessionUser() user: RequestUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.erCaseAttachmentService.uploadNteDocs(nteId, user, file);
  }

  @Delete('nte/:nteId/documents/:attachmentId')
  @ApiOperation({
    summary: 'NTE Attachment deleted successfully.',
  })
  async deleteNteDoc(
    @Param('nteId', ParseUUIDPipe) nteId: string,
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.erCaseAttachmentService.deleteNteDoc(nteId, attachmentId, user);
  }

  @Put('written-explaination/:explanationId/uploads')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload Attachment for Written Explaination',
  })
  @ApiPostResponse('Attachment uploaded successfully')
  uploadExplainationDoc(
    @Param('explanationId', ParseUUIDPipe) explanationId: string,
    @SessionUser() user: RequestUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.erCaseAttachmentService.uploadExplanationDocs(
      explanationId,
      user,
      file,
    );
  }

  @Put('hearing/:hearingId/uploads')
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
  @ApiOperation({
    summary: 'Upload Attachments for Hearing Minutes or Attendee documents',
  })
  @ApiPostResponse('Attachment uploaded successfully')
  uploadHearingDocs(
    @Param('hearingId', ParseUUIDPipe) hearingId: string,
    @SessionUser() user: RequestUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.erCaseAttachmentService.uploadHearingDocs(
      hearingId,
      user,
      files,
    );
  }

  @Put('notice-of-decision/:decisionId/uploads')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload Attachment for Notice of Decision',
  })
  @ApiPostResponse('Attachment uploaded successfully')
  uploadDecisionDoc(
    @Param('decisionId', ParseUUIDPipe) decisionId: string,
    @SessionUser() user: RequestUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.erCaseAttachmentService.uploadDecisionDocs(
      decisionId,
      user,
      file,
    );
  }

  @Put('notice-of-decision/authority-to-deduct/:deductPayrollId/uploads')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload Attachment for Authority to Deduct Payroll',
  })
  @ApiPostResponse('Attachment uploaded successfully')
  authorityToDeductDoc(
    @Param('deductPayrollId', ParseUUIDPipe) deductPayrollId: string,
    @SessionUser() user: RequestUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.erCaseAttachmentService.uploadAuthorityToDeductDocs(
      deductPayrollId,
      user,
      file,
    );
  }
}
