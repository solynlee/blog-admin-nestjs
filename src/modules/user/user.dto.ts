import { applyDecorators } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @PasswordValidator()
  password: string;
  roles: string;
  nickname: string;
  sex: number;
  title: string;
  avatar: string;
  tags: string;
  @IsEmail({}, { message: '邮箱格式无效' })
  email: string;
  @IsPhoneNumber()
  phone: string;
  address: string;
  des: string;
  active: number;
}

export class UpdateUserInfoDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @IsEmail({}, { message: '邮箱格式无效' })
  email: string;
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string;
  @IsNotEmpty({ message: '性别不能为空' })
  sex: number;
  @IsOptional()
  des: string;
  @IsPhoneNumber('CN', { message: '手机号格式无效' })
  phone: string;
  @IsOptional()
  address: string;
}

export class UpdateUserPasswordDto {
  id: number;
  password: string;
}

//组合装饰器
function PasswordValidator() {
  return applyDecorators(
    IsString({ message: 'Password must be a string' }),
    MinLength(6, { message: 'Password must be at least 6 characters long' }),
    MaxLength(20, { message: 'Password must be at most 20 characters long' }),
  );
}
