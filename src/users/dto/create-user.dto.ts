import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString({message: "must be a string"})
  @IsEmail({}, {message: "got incorrect email"})
  readonly email: string;

  @IsString({message: "must be a string"})
  @Length(4, 16, {message: "range: 4-16 symbols"})
  readonly password: string;

  @IsString({message: "must be a string"})
  readonly firstName: string;

  @IsString({message: "must be a string"})
  readonly lastName: string;
}