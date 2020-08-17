import { Test, TestingModule } from '@nestjs/testing'
import { CatService } from './cat.service'
import { CacheService } from '../cache/cache.service'
import { CatNotFound } from './cat-errors'

const catFixture = {
  name: "Finn",
  birth_date: new Date(1900,5,10),
  age: 1500,
  favorite_food: "tears and sorrow",
}

const CacheServiceMock = jest.fn().mockImplementation(() => ({
  get: jest.fn().mockResolvedValue(JSON.stringify(catFixture))
}))

const WhiskasServiceMock = jest.fn().mockImplementation(() => ({
  
}))

describe('CatService', () => {
  let service: CatService
  let cacheService: CacheService
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        {
        provide: 'CacheService',
        useFactory: () => new CacheServiceMock(),
        },
        {
        provide: 'WhiskasService',
        useFactory: () => new WhiskasServiceMock(),
        }
      ],
    }).compile();

    service = module.get<CatService>(CatService)
    cacheService = module.get<CacheService>(CacheService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getCat', () => {
    it('should return correct object', async () => {
      const response = await service.getCat('Finn')

      const parsedCatFixture = {
        ...catFixture,
        birth_date: catFixture.birth_date.toISOString()
      }

      expect(response).toStrictEqual(parsedCatFixture)
    })

    it('should call get function correctly', async () =>  {
      const spyCacheService = jest.spyOn(cacheService, 'get')

      await service.getCat('Finn')
       
      expect(spyCacheService).toHaveBeenCalledTimes(1)
      expect(spyCacheService).toHaveBeenCalledWith('Finn')
    })

    it('should throw error if cat is not found', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null)
      
      try{
        await service.getCat('Finn')      
      }catch(error){
        expect(error).toBeInstanceOf(CatNotFound)
      }
      expect.assertions(1)
    })
    
  })
})
