import { plainToInstance, Type } from 'class-transformer';

export interface IBaseResponse<T = any> {
  message: string;
  code: number;
  data?: T;
}

export interface IListRespData<T = any> {
  list: T[];
}

export interface IPaginationInfo {
  page: number;
  limit: number;
  total: number;
}

export interface IPaginationRespData<T = any> extends IListRespData<T> {
  pagination: IPaginationInfo;
}

export class PaginatedResponse<T> {
  data!: T[];

  @Type(() => IPaginationInfo)
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  toPlain(): PaginatedResponse<T> {
    return plainToInstance(PaginatedResponse, this);
  }
}
