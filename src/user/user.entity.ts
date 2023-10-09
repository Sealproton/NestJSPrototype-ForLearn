import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';
//Its decorator to help TypeORm to understand some dif properties we going to add to entity
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterUpdate()
  logUpdate() {
    console.log('Update user at id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Remove user at id', this.id);
  }
}
