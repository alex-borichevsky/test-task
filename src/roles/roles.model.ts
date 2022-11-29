import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/users.model";

@Entity("roles")
export class Role{
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number

  @Column()
  value: string;

  @Column()
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}