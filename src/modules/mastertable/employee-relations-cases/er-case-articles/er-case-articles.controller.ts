import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErCaseArticlesService } from './er-case-articles.service';
import { CreateErCaseArticleDto, UpdateErCaseArticleDto } from './dto/er-case-articles.dto';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MASTERTABLES } from 'src/utils/constants/ability.constant';
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ErCaseArticlePaginationDto } from 'src/utils/dtos/er-case-article-pagination.dto';

@ApiTags('Mastertable - Employee Relation Case(Article)')
@Controller({ path:'mastertable', version: '2'})
export class ErCaseArticlesController {
    constructor (private readonly erCaseArticleService: ErCaseArticlesService) {}

    @Get('er-case-articles/:erCaseArticleId')
    @ApiOperation({ summary: 'Get a ER Case Article' })
    @ApiGetResponse('Here is the ER Case Article')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    getArticle(
        @Param('erCaseArticleId', new ParseUUIDPipe()) erCaseArticleId: string,
        @SessionUser() user: RequestUser,
    ) {
        return this.erCaseArticleService.getArticle(erCaseArticleId, user);
    }

    @Get('er-case-articles')
    @ApiOperation({ summary: 'Get all ER Case Articles' })
    @ApiGetResponse('List of ER Case Articles')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    getArticles(
        @SessionUser() user: RequestUser,
        @Query() dto: ErCaseArticlePaginationDto,
    ) {
        return this.erCaseArticleService.getArticles(user, dto);
    }

    @Post('er-case-articles')
    @ApiBody({
        type: CreateErCaseArticleDto,
        description: 'Payload to create ER Case Articles',
    })
    @ApiOperation({ summary: 'Create a new ER Case Article' })
    @ApiPostResponse('ER Case Article created successfully')
    @Can({ action: ACTION_CREATE, subject: MASTERTABLES })
    createErCaseArticle(
        @Body() dto: CreateErCaseArticleDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.erCaseArticleService.createArticle(dto, user);
    }

    @Put('er-case-articles/:erCaseArticleId')
    @ApiBody({
        type: UpdateErCaseArticleDto,
        description: 'Payload to update ER Case Article',
    })
    @ApiOperation({ summary: 'Update a current ER Case Article' })
    @ApiPatchResponse('ER Case Article updated succesffuly')
    @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
    updateErCaseArticle(
        @Param('erCaseArticleId', new ParseUUIDPipe()) erCaseArticleId: string,
        @Body() dto: UpdateErCaseArticleDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.erCaseArticleService.updateArticle(
            erCaseArticleId,
            dto,
            user,
        );
    }
}
