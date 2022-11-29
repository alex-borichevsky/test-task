import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/users.model";
import { Role } from "./roles.model";

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  exports: [
    RolesService
  ],
  imports: [
    TypeOrmModule.forFeature([Role, User])
  ]
})
export class RolesModule {}
