import { Test, TestingModule } from '@nestjs/testing'
import { CacheService } from './cache.service'
import { CacheNotConnected } from './cache-errors'

jest.mock('ioredis', () => {
  const Redis = jest.fn().mockImplementation(() => {

    return {
      get: jest.fn(),
      set: jest.fn(),
      status: 'ready',
    }
  })

  return Redis
})

describe('CacheService', () => {
  let service: CacheService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  
  describe('checkConnection', () => {    
    it('should return true if the connection is ready', () => {
      const response = service.checkConnection()
      expect(response).toBe(true)
    })
  
    it('should throw an error when the connection is not ready', () => {
      expect.assertions(1)
      service.client.status = ''
      try{
        service.checkConnection()
      }catch(error){ 
        expect(error).toBeInstanceOf(CacheNotConnected)
      }
    })

  })
})
