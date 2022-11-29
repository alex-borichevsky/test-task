import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.model";
import { Repository } from "typeorm";
import { RolesService } from "../roles/roles.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { FilesService } from "../files/files.service";
import * as PDFDocument from "pdfkit";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User> ,
              private roleService: RolesService,
              private fileService: FilesService
              ) {
  }
  public async getUserByEmail(email: string) {
    return this.userRepository.findOne( {where: [{email}], relations: ['roles']});
  }
  public async fetchUsers() {
    return await this.userRepository.find({ relations: ['roles'] });
  }

  public async createUser(dto: CreateUserDto, image: any) {
    const fileName = await this.fileService.createFile(image);

    const newUser = this.userRepository.create({
      ...dto,
      createdAt: new Date(),
      image: fileName
    });
    const role = await this.roleService.getRole("ADMIN");
    newUser.roles = [role];
    return this.userRepository.save(newUser);
  }

  public updateUser(updateId: number, dto: UpdateUserDto) {
    return this.userRepository.update(updateId, { ...dto });
  }

  public delete(id: number) {
    return this.userRepository.delete(id);
  }

  public async getUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  public async addRole(dto: AddRoleDto) {
    const id = dto.userId;
    const user = await this.userRepository.findOneBy({id});
    const role = await this.roleService.getRole(dto.value);
    if(user && role) {
      user.roles.push(role);
      return await this.userRepository.save(user);

    }
    throw new HttpException("User or Role not found", HttpStatus.NOT_FOUND);
  }
  public async banUser(dto: BanUserDto) {
    const id = dto.userId;
    const user = await this.userRepository.findOneBy({id});
    user.banned = true;
    return this.userRepository.save(user);
  }
  public async generatePDF(email: string): Promise<Buffer> {
    const user = await this.getUserByEmail(email);
    const pdfBuffer: Buffer = await new Promise(resolve => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      })

      doc.text("firstName: " + user.firstName);
      doc.text( "lastName: "+ user.lastName);
      doc.text("url image: " + user.image);
      doc.end()

      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
    })

    user.pdf = pdfBuffer;
    await this.userRepository.save(user);
    return pdfBuffer;
  }
}
