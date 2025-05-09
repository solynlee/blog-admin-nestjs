import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class DateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 递归遍历对象，格式化所有 Date 类型字段
        const formatDates = (obj: any) => {
          for (const key in obj) {
            if (obj[key] instanceof Date) {
              obj[key] = moment(obj[key]).format('YYYY-MM-DD HH:mm:ss');
            } else if (typeof obj[key] === 'object') {
              formatDates(obj[key]);
            }
          }
          return obj;
        };
        return formatDates(data);
      }),
    );
  }
}
