import { Injectable } from '@nestjs/common'

import { Cat, Message } from './cat.interface'
import { CatNotFound, CatAlreadyAdopted, WrongCatBirthday } from './cat-errors'
import { CacheService } from '../cache/cache.service'
import { WhiskasService } from '../whiskas/whiskas.service'

// todas as informações sobre o que deve ser testado e mockado sempre se encontram
// no próprio arquivo a ser testado.
@Injectable()
export class CatService {

    constructor(
        private readonly cacheService: CacheService,      // temos que mockar todos os serviços que sejam
        private readonly whiskasService: WhiskasService,  // providers do service sendo testado
    ) {}

    async getCat(name: string): Promise<Cat> {
        const catString = await this.cacheService.get(name) // todas as chamadas a serviços mockados devem ser verificadas
        if (!catString) throw new CatNotFound(name) // todas as branches (ifs) devem ser testadas

        const cat = JSON.parse(catString) // *este tipo de chamada é testada através do teste do retorno abaixo vv

        return cat // todos os retornos devem ser testados
    }

    async getFoodForCat(name: string): Promise<Message> {
        const cat = await this.getCat(name) // mesmo esquema. estas linhas são testadas com os métodos HaveBeenCalledTimes e HaveBeenCalledWith
        // note que não é necessário testar o erro CatNotFound novamente, já que ele foi testado na função getCat 

        const { favorite_food } = cat // esse destruct será testado ao verificar a chamada ao método findFood

        await this.whiskasService.findFood(favorite_food) // Aqui também não é necessário testar potenciais erros que o whiskasService jogue (como OutOfStock)
        // O teste dos erros referentes ao whiskasService serão feitos no whiskas-service.spec.ts

        return { message: `Excellent! ${cat} has been fed some delicious ${favorite_food}` } // e estas linhas são testadas com o método toStrictEqual
    }

    async adoptKitty(catRequest: Cat): Promise<Message> {
        const cat = await this.cacheService.get(name)
        if (cat) throw new CatAlreadyAdopted(name) // Os erros podem ser testados apenas por instanceOf,
        // desde que o teste de classe (em cat-errors.spec.ts) ou o teste do controller validem o formato.

        await this.cacheService.set(catRequest.name, JSON.stringify(catRequest))

        return { message: `Congratulations! ${cat} has been succesfully adopted!` }
    }

    async celebrateKitty(name: string, catRequest: Cat): Promise<Message> {
        const cat = await this.getCat(name)        
        if (cat.birth_date !== catRequest.birth_date) throw new WrongCatBirthday(name)
        
        const grownUpKitty = {                      // novamente, o formato deste objeto será testado ao
            ...catRequest,                          // fazer um spy para o método set do cacheService
            age: Number(catRequest.age) + 1,        // e esta soma também pode ser validada através da validação do retorno
        }                                           // já que o retorno contém o atributo grownUpKitty.age

        await this.cacheService.set(name, JSON.stringify(grownUpKitty))

        return { message: `Happy Birthday ${name}! You're now ${grownUpKitty.age} years old!` }
    }
}
