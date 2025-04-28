import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('menu')
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Unique(['name'])
  name: string;
  @Column()
  path: string;
  @Column()
  redirect: string;
  @Column()
  meta: string;
  @Column()
  pid: number;
  @Column()
  active: number;
}
