import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

import { CacheNotConnected } from './cache-errors'

// este teste requer o mock de uma biblioteca que utilizamos
// para fazer esse mock utilizaremos o jest.mock()
// os métodos a serem mockados sempre são somentes o que são utilizados no código
// no nosso caso, jest.mock() conterá os métodos 'get' e 'set' e o atributo 'status'
// nas horas de mockar uma biblioteca, a documentação (no nosso caso, do ioredis) é sua melhor amiga.
@Injectable()
export class CacheService {
    private readonly client: Redis

    constructor(){
        this.client = new Redis()
    }

    checkConnection (): boolean {
        if (this.client.status === 'ready') return true
        throw new CacheNotConnected()
        // neste método temos duas branches. Uma será testada por uma chamada simples ao método checkConnection
        // esperando um retorno de 'true'. na segunda chamada, será necessário modificar o valor do campo 'status'
        // para que o erro seja jogado.
    }

    get(key: string): Promise<string>{
        this.checkConnection() // não há necessidade de testar o erro CacheNotConnected nos métodos get e set
        // já que o teste já foi feito no método checkConnetion
        return this.client.get(key)
    }

    set(key: string, value = ''): Promise<string>{ 
        // um valor padrão assignado como o da string vazia no parametro 'value' conta como uma branch e deve ser testado como tal
        // para testar essa branch, basta chamar a função com valor nulo neste parâmetro
        this.checkConnection()

        return this.client.set(key, value)
    }
}
