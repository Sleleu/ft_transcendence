import { Module } from '@nestjs/common';
import { IntraController } from './intra.controller';
import { IntraService } from './intra.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [IntraController],
  providers: [IntraService]
})
export class IntraModule {}
