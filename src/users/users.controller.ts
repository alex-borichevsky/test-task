import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post, Res, UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/role-auth.decorator";
import { AddRoleDto } from "./dto/add-role.dto";
import { ValidationPipe } from "../pipes/validation.pipe";
import { BanUserDto } from "./dto/ban-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreatePdfDto } from "./dto/create-pdf.dto";

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(ValidationPipe)
  create(@Body() userDto: CreateUserDto,
         @UploadedFile() image
         ) {
    return this.userService.createUser(userDto, image);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.userService.fetchUsers();
  }

  @Post('/pdf')
  public async getPDF(
    @Res() res, @Body() dto: CreatePdfDto
  ): Promise<void> {
    try {
      const buffer = await this.userService.generatePDF(dto.email);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=example.pdf',
        'Content-Length': buffer.length,
      })

      res.end(buffer);
      res.json(true);
    }catch (ex) {
      console.log(ex);
    }
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/ban')
  ban(@Body() dto: BanUserDto) {
    return this.userService.banUser(dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/:email')
  getOne(@Param("email") email: string) {
    return this.userService.getUserByEmail(email);
  }

}
