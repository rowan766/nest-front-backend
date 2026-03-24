import { Module } from '@nestjs/common';
import { DictTypeController } from './dict-type.controller';
import { DictTypeService } from './dict-type.service';
import { DictDataController } from './dict-data.controller';
import { DictDataService } from './dict-data.service';
import { PrismaModule } from '../../infrastructure';

@Module({
  imports: [PrismaModule],
  controllers: [DictTypeController, DictDataController],
  providers: [DictTypeService, DictDataService],
  exports: [DictTypeService, DictDataService],
})
export class DictModule {}
