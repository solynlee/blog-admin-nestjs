import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { UpdateAvatarDto, UpdatePasswordDto, UserDto } from './user.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ApiFailedException } from '@/exceptions/api-failed.exception';
import { ErrorEnum } from '@/constants/errorx';
import { isEmpty } from 'lodash';
import * as md5 from 'md5';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  findOne(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }
  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
  createUser(userDto: UserDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.username = userDto.username;
    user.password = userDto.password;
    user.roles = userDto.roles;
    user.nickname = userDto.nickname;
    user.avatar = userDto.avatar;
    user.active = 1;
    return this.userRepository.save(user);
  }
  removeUser(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.findUserBy({ username });
  }

  async findByUserID(id: number): Promise<UserEntity | null> {
    return this.findUserBy({ id });
  }

  private async findUserBy(
    condition: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy(condition);
    if (!user) {
      throw new ApiFailedException(ErrorEnum.CODE_1026);
    }
    return user;
  }

  update(id: number, updateUserDto: QueryDeepPartialEntity<UserEntity>) {
    return new Promise((resolve, reject) => {
      this.userRepository.update(id, updateUserDto).then((res) => {
        if (res.affected) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findUserBy({ id });
    if (isEmpty(user)) {
      throw new ApiFailedException(ErrorEnum.CODE_1022);
    }
    const md5OldPassword = md5(updatePasswordDto.oldPassword).toUpperCase();
    if (user.password !== md5OldPassword) {
      throw new ApiFailedException(ErrorEnum.CODE_1022);
    }
    const md5NewPassword = md5(updatePasswordDto.newPassword).toUpperCase();
    user.password = md5NewPassword;
    console.log(user);
    return this.userRepository.update(id, user);
  }

  updateAvatar(id: number, updateAvatarDto: UpdateAvatarDto) {
    return this.userRepository.update(id, updateAvatarDto);
  }
  // getUserInfo(req: Request): Promise<UserEntity | null> {
  //   // return this.userRepository.findOneBy({ username: req.user.username });
  //   return null;
  // }
}
