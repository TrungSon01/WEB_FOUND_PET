import { Global, Module } from '@nestjs/common';
import { FunctionSystemService } from './function-system.service';

@Global()
@Module({
  providers: [FunctionSystemService],
  exports: [FunctionSystemService],
})
export class FunctionSystemModule {}
