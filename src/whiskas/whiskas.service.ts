import { Injectable } from '@nestjs/common'

import { CacheService } from '../cache/cache.service'
import { OutOfStock } from './whiskas-errors'

@Injectable()
export class WhiskasService {
    constructor(
        private readonly cacheService: CacheService,
    ) {}

    async findFood(favoriteFood: string): Promise<boolean> {
        const foodString = await this.cacheService.get(favoriteFood)
        if(!foodString) throw new OutOfStock(favoriteFood)

        const food = JSON.parse(foodString)

        const updatedFoodStock = {
            ...food,
            quantity: food.quantity - 1,
        }

        this.cacheService.set(favoriteFood, updatedFoodStock)

        return true
    }


}
