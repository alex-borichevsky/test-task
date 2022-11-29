import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../exceptions/validation.exception";


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    //получаем объект который будем валидировать - это тело запроса
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);


    if(errors.length) {
      const messages = errors.map(err => {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`
      })
      throw new ValidationException(messages);
    }
    return value;
  }

}