import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { FilesModule } from './files/files.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/users.model";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { Role } from "./roles/roles.model";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static')
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "test_proj_db",
      synchronize: true,
      logging: false,
      entities: [User, Role],
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    RolesModule],

  controllers: [],
  providers: [],
})
export class AppModule {}
