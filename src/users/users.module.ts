import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.model";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { FilesModule } from "../files/files.module";
import { Role } from "../roles/roles.model";

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    FilesModule,
    RolesModule,
    TypeOrmModule.forFeature([User, Role]),
    forwardRef(() => AuthModule)
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
