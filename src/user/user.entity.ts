import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
//Its decorator to help TypeORm to understand some dif properties we going to add to entity
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
  
  @Column()
  password: string;
}
