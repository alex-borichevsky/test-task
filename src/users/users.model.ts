import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../roles/roles.model";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({default: ''})
  image: string;

  @Column({type: 'bytea', default: []})
  pdf: Uint8Array;

  @Column()
  createdAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @Column({default: false})
  banned: boolean;

  @Column({default: ''})
  banReason: string;
}