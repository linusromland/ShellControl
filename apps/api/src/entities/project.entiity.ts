// External dependencies
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;

  @Column()
    directory: string;

  @Column()
    command: string;
}
