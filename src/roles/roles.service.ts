import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./roles.model";
import { Repository } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private roleRepository: Repository<Role>) {
  }

  public async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto);
    return this.roleRepository.save(role);
  }

  public async getRole(value: string) {
    const role = await this.roleRepository.findOneBy({value});
    return role;
  }
}