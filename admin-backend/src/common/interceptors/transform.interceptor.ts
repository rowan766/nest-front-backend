import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from './response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        if (this.isResponseEnvelope(data)) {
          return {
            ...data,
            path: data.path || request.originalUrl,
            timestamp: data.timestamp || new Date().toISOString(),
          };
        }

        return {
          code: 200,
          message: '请求成功',
          data,
          timestamp: new Date().toISOString(),
          path: request.originalUrl,
        };
      }),
    );
  }

  private isResponseEnvelope(data: unknown): data is IResponse<T> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'code' in data &&
      'message' in data &&
      'timestamp' in data &&
      'path' in data
    );
  }
}
