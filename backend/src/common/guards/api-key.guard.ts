import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly expectedKey = process.env.API_KEY;
  private readonly headerName = 'x-api-key';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.headers[this.headerName] as string | undefined;

    if (!this.expectedKey) {
      // If API_KEY is not configured, block requests to avoid accidental open access.
      throw new UnauthorizedException('API key not configured');
    }

    if (!provided || provided !== this.expectedKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
