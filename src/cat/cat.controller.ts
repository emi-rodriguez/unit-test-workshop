import { Controller, Get, Post, Body, Put, Param, Res } from '@nestjs/common'
import { Response } from 'express'

import { Cat } from './cat.interface'
import { CatService } from './cat.service'

import { CatNotFound, CatAlreadyAdopted, WrongCatBirthday } from './cat-errors'
import { OutOfStock } from '../whiskas/whiskas-errors'
import { CacheNotConnected } from '../cache/cache-errors'


@Controller('cat')
export class CatController {

    constructor(
        private readonly catService: CatService, // este é o único service a ser mockado para o controller
        // apesar de erros referentes ao cacheService e ao whiskasService aparecerem aqui, o único ponto de contato
        // entre o controller e esses services é através do catService, então será por meio deste que os erros
        // serão mockados.
    ){}

    @Get('feed/:id')
    async feedCat(@Param('id') name: string, @Res() res: Response):Promise<any> {
        try {
            const response = await this.catService.getFoodForCat(name) // temos que testar se o método foi chamado corretamente
            res.status(200).send(response) // e a resposta do caso de sucesso. O teste do método chamado corretamente não precisa
            // ocorrer em todos os casos. Pode estar no caso de sucesso, ou um teste separado somente para validar a(s) chamada(s) do(s) método(s)
        } catch (error) {
            if (error instanceof CatNotFound) res.status(404).send(error.message) // cada erro é testado para validar cada branch (if/else if/else)
            else if (error instanceof OutOfStock) res.status(404).send(error.message) // fazemos a execução vir para esta branch mockando a resposta com o jest.spyOn().mockRejectedValue()
            else if (error instanceof CacheNotConnected) res.status(502).send(error.message) // o spy ficará de olho no serviço, e quando o serviço for chamado, irá jogar a instância de erro determinada
            else res.status(500).send(error.message)
        }
    }

    @Post('adopt')
    async adoptCat(@Body() catRequest: Cat, @Res() res: Response): Promise<any> {
        try {
            const response = await this.catService.adoptKitty(catRequest)
            res.status(201).send(response)
        } catch (error) {
            if (error instanceof CatAlreadyAdopted) res.status(409).send(error.message)
            else if (error instanceof CacheNotConnected) res.status(502).send(error.message)
            else res.status(500).send(error.message)
        }
    }

    @Put('birthday/:id')
    async celebrateCatBirthday(@Param('id') name: string, @Body() catRequest: Cat, @Res() res: Response): Promise<any> {
        try {
            const response = await this.catService.celebrateKitty(name, catRequest)
            res.status(200).send(response)
        } catch (error) {
            if (error instanceof WrongCatBirthday) res.status(401).send(error.message)
            else if (error instanceof CatNotFound) res.status(404).send(error.message)
            else if (error instanceof CacheNotConnected) res.status(502).send(error.message)
            else res.status(500).send(error.message)
        }
    }
}