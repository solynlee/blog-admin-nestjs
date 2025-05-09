import { Type } from 'class-transformer';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class PaginatedResponse<T> {
  data!: T[];
  @Type(() => PaginationDto)
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  toPlain(): PaginatedResponse<T> {
    return plainToInstance(PaginatedResponse, this); // ✅ 自动转换当前实例
  }
}
