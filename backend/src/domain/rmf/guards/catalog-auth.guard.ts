import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class CatalogAuthGuard extends AuthGuard(['system-jwt', 'client-jwt']) {
  private readonly logger = new Logger(CatalogAuthGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.debug('Authenticating request for catalog access');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    this.logger.debug(`Authentication attempt: ${JSON.stringify({ success: !!user, error: err?.message, info })}`);
    
    if (err || !user) {
      this.logger.warn(`Authentication failed: ${err?.message || 'User not found'}`);
      return null;
    }

    this.logger.debug(`User authenticated successfully: ${user.email} (${user.type})`);
    return user;
  }
}
