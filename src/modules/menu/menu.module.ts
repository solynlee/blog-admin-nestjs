import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuEntity } from './mebu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
