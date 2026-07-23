import { Controller, Post, Body, Headers, UseGuards, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TutorService } from './tutor.service';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { 
  TutorRequest, 
  TutorResponse, 
  FastTurnResponse,
  FeedbackResponse,
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

  @Post('chat-fast')
  async chatFast(
    @Body() body: TutorRequest & { voice?: string },
    @Headers('x-api-key') clientApiKey?: string
  ): Promise<FastTurnResponse> {
    return this.tutorService.processFastTurn(body, clientApiKey);
  }

  @Post('chat-feedback')
  async chatFeedback(
    @Body() body: TutorRequest,
    @Headers('x-api-key') clientApiKey?: string
  ): Promise<FeedbackResponse> {
    return this.tutorService.processFeedbackAsync(body, clientApiKey);
  }

  @Post('chat-stream')
  @Sse('chat-stream')
  chatStream(
    @Body() body: TutorRequest & { voice?: string },
    @Headers('x-api-key') clientApiKey?: string
  ): Observable<MessageEvent> {
    return this.tutorService.processChatStream(body, clientApiKey);
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
