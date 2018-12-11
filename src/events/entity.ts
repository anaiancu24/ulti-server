import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { MinLength, IsString } from 'class-validator';
import Team from '../team/entity'
import Game from '../game/entity'

@Entity()
export default class Event extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  name: string

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  location: string

  @Column('simple-array', {nullable: true})
  teams: Team[] | null


  @OneToMany(() => Game, game => game.event)
  games: Game[] | null;
}