import { Controller, Get, Post, Body, Put, Param, Res } from '@nestjs/common'
import { Response } from 'express'

import { CatRequest } from './cat-request.interface'


@Controller('cat')
export class CatController {

    @Get('feed/:id')
    async feedCat(@Param('id') name: string, @Res() res: Response):Promise<boolean> {
        res.status(200).send(name)
        return true
    }

    @Post('adopt')
    async adoptCat(@Body() catRequest: CatRequest, @Res() res: Response): Promise<boolean> {
        res.status(200).send(catRequest)
        return true
    }

    @Put('birthday/:id')
    async celebrateCatBirthday(@Param('id') name: string, @Body() catRequest: CatRequest, @Res() res: Response): Promise<boolean> {
        res.status(200).send(catRequest)
        return true
    }
}