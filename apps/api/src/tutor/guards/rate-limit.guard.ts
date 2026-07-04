import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RateLimitGuard implements CanActivate {
  // Store request timestamps in memory: identifier -> timestamp[]
  private clients = new Map<string, number[]>();

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Identifier by API Key (if provided) or fallback to IP Address
    const apiKey = request.headers['x-api-key'] as string;
    const ip = request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown-ip';
    const clientId = apiKey ? `key:${apiKey}` : `ip:${ip}`;

    // Read limits from ConfigService/Env with sensible defaults (15 requests per 60 seconds)
    const limit = Number(this.configService.get<number>('RATE_LIMIT_MAX')) || 15;
    const windowMs = (Number(this.configService.get<number>('RATE_LIMIT_WINDOW_SECS')) || 60) * 1000;

    const now = Date.now();
    const timestamps = this.clients.get(clientId) || [];

    // Filter out expired timestamps
    const activeTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < windowMs,
    );

    if (activeTimestamps.length >= limit) {
      throw new HttpException(
        'Rate limit exceeded. Please pause speaking for a moment (rate limit active).',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    activeTimestamps.push(now);
    this.clients.set(clientId, activeTimestamps);

    return true;
  }
}
