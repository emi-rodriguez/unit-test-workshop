import { Injectable } from '@nestjs/common'

import { CacheService } from '../cache/cache.service'
import { OutOfStock } from './whiskas-errors'

// desta vez só tem os lembretes. Qualquer coisa só voltar ao exemplo do cat.service.ts!
@Injectable()
export class WhiskasService {
    constructor(
        private readonly cacheService: CacheService, // os services a serem mockados
    ) {}

    async findFood(favoriteFood: string): Promise<boolean> {
        const foodString = await this.cacheService.get(favoriteFood) // as chamadas a serem testadas
        if(!foodString) throw new OutOfStock(favoriteFood)

        const food = JSON.parse(foodString)  // testado na chamada do set

        const updatedFoodStock = {         // testado na chamada do set
            ...food,
            quantity: food.quantity - 1,
        }

        this.cacheService.set(favoriteFood, updatedFoodStock) // as chamadas a serem testadas

        return true  // o retonro a ser testado
    }


}
