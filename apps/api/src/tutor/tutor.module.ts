import { Module } from '@nestjs/common';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';
import { RateLimitGuard } from './guards/rate-limit.guard';

@Module({
  controllers: [TutorController],
  providers: [TutorService, RateLimitGuard],
  exports: [TutorService],
})
export class TutorModule {}
