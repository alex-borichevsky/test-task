import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/registration')
  @UseInterceptors(FileInterceptor('image'))
  registration(@Body() userDto: CreateUserDto,
               @UploadedFile() image) {
    return this.authService.registration(userDto, image);
  }

}
