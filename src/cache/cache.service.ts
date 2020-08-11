import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

import { CacheNotConnected } from './cache-errors'

@Injectable()
export class CacheService {
    private readonly client: Redis

    constructor(){
        this.client = new Redis()
    }

    checkConnection (): boolean {
        if (this.client.status === 'ready') {
          return true
        }
        throw new CacheNotConnected()
      }

    get(key: string): Promise<string>{
        this.checkConnection()

        return this.client.get(key)
    }

    set(key: string, value = ''): Promise<string>{
        this.checkConnection

        return this.client.set(key, value)
    }
}
