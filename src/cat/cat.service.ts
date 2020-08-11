import { Injectable } from '@nestjs/common'

import { CatRequest, Message } from './cat-request.interface'
import { CatNotFound, CatAlreadyAdopted, WrongCatBirthday } from './cat-errors'
import { CacheService } from '../cache/cache.service'
import { WhiskasService } from '../whiskas/whiskas.service'

@Injectable()
export class CatService {

    constructor(
        private readonly cacheService: CacheService,
        private readonly whiskasService: WhiskasService,
    ) {}

    async getFoodForCat(name: string): Promise<Message> {
        const catString = await this.cacheService.get(name)
        if (!catString) throw new CatNotFound(name)

        const cat = JSON.parse(catString)

        const { favorite_food } = cat

        await this.whiskasService.findFood(favorite_food)

        return { message: `Excellent! ${cat} has been fed some delicious ${favorite_food}`}
    }

    async adoptKitty(catRequest: CatRequest): Promise<Message> {
        const cat = await this.cacheService.get(name)
        if (cat) throw new CatAlreadyAdopted(name)

        await this.cacheService.set(catRequest.name, JSON.stringify(catRequest))

        return { message: `Congratulations! ${cat} has been succesfully adopted!`}
    }

    async celebrateKitty(name: string, catRequest: CatRequest): Promise<Message> {
        const catString = await this.cacheService.get(name)
        if (!catString) throw new CatNotFound(name)

        const cat = JSON.parse(catString)
        
        if (cat.birth_date !== catRequest.birth_date) throw new WrongCatBirthday(name)
        
        const grownUpKitty = {
            ...catRequest,
            age: Number(catRequest.age) + 1,
        }

        await this.cacheService.set(name, JSON.stringify(grownUpKitty))

        return { message: `Happy Birthday ${name}! You're now ${grownUpKitty.age} years old!`}
    }
}
