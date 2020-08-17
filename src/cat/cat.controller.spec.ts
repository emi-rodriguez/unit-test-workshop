import { Test, TestingModule } from '@nestjs/testing'
import { CatController } from './cat.controller'
import { CatService } from './cat.service'
import { CatNotFound } from './cat-errors'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MockExpressResponse = require('mock-express-response')
//  npm install mock-express-response --save-dev

// jest.fn().mockResolvedValue('thomas') === jest.fn().mockImplementation(() => Promise.resolve('thomas'))

const CatServiceMock = jest.fn().mockImplementation(() => ({
  getFoodForCat: jest.fn().mockResolvedValue({
    message: 'Corsinha está satisfeito :)'
  })
}))

describe('Cat Controller', () => {
  let controller: CatController
  let catService: CatService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatController],
      providers: [{
        provide: 'CatService',
        useFactory: () => new CatServiceMock(),
      }]
    }).compile();

    controller = module.get<CatController>(CatController)
    catService = module.get<CatService>(CatService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('feedCat', () => {
    it('should respond with http status 200 when succesful', async () => {
      expect.assertions(2)
      const response = new MockExpressResponse()
      
      await controller.feedCat('corsinha', response)

      expect(response.statusCode).toBe(200)
      expect(response._getJSON()).toStrictEqual({"message": "Corsinha está satisfeito :)"})
    })
  
    it('should call getFoodForCat correctly', async () => {
      expect.assertions(2)
      const serviceSpy = jest.spyOn(catService, 'getFoodForCat')

      const response = new MockExpressResponse()
      
      await controller.feedCat('corsinha', response)

      expect(serviceSpy).toHaveBeenCalledTimes(1)
      expect(serviceSpy).toHaveBeenCalledWith('corsinha')
    })

    it('should respond with http status 404 when Cat is not Found', async () => {
      jest.spyOn(catService, 'getFoodForCat').mockRejectedValue(new CatNotFound('corsinha'))

      const response = new MockExpressResponse()
      await controller.feedCat('corsinha', response)

      expect(response.statusCode).toBe(404)
      expect(response._getJSON()).toStrictEqual({"message": "corsinha isn't here :( Maybe they haven't been adopted yet?"})
    })
  
    it('should respond with http status 404 when Out of Stock', () => {})
    it('should respond with http status 502 when Cache not Found', () => {})
  
    it('should respond with http status 500 when Internal server error', async () => {
      jest.spyOn(catService, 'getFoodForCat').mockRejectedValue(new Error('processing error'))

      const response = new MockExpressResponse()
      await controller.feedCat('corsinha', response)

      expect(response.statusCode).toBe(500)
      expect(response._getString()).toStrictEqual('processing error')
    })
  })
})