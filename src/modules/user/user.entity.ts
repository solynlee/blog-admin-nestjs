import { applyDecorators, Inject, Injectable } from '@nestjs/common';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('admin_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Unique(['username'])
  username: string;
  @Column()
  password: string;
  @Column()
  avatar: string;
  @Column({ type: 'simple-array' })
  roles: string[];
  @Column()
  nickname: string;
  @Column()
  active: number;
  @Column()
  email: string;
  @Column()
  phone: string;
  @Column()
  title: string;
  @Column()
  address: string;
  @Column()
  des: string;
  @Column({ type: 'simple-array' })
  tags: string[];
  @Column()
  sex: number;
}
