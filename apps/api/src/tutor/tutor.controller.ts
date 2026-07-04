import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { 
  TutorRequest, 
  TutorResponse, 
  ScoreReport, 
  ConversationTurn, 
  ConversationMode 
} from '@language-tutor/shared-types';

@Controller('tutor')
@UseGuards(RateLimitGuard)
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post('chat')
  async chat(
    @Body() body: TutorRequest & { voice?: string },
    @Headers('x-api-key') clientApiKey?: string
  ): Promise<TutorResponse> {
    return this.tutorService.processChat(body, clientApiKey);
  }

  @Post('evaluate')
  async evaluate(
    @Body() body: { 
      history: ConversationTurn[]; 
      mode: ConversationMode; 
      scenario?: string 
    },
    @Headers('x-api-key') clientApiKey?: string
  ): Promise<ScoreReport> {
    return this.tutorService.evaluateSession(
      body.history,
      body.mode,
      body.scenario,
      clientApiKey
    );
  }
}
