import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatService } from './cat/cat.service';
import { CatController } from './cat/cat.controller';
import { CacheService } from './cache/cache.service';
import { WhiskasService } from './whiskas/whiskas.service';

@Module({
  imports: [],
  controllers: [AppController, CatController],
  providers: [AppService, CatService, CacheService, WhiskasService],
})
export class AppModule {}
