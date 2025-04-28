import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
    condition: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy(condition);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    user.roles = JSON.parse(user.roles);
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
  // getUserInfo(req: Request): Promise<UserEntity | null> {
  //   // return this.userRepository.findOneBy({ username: req.user.username });
  //   return null;
  // }
}
