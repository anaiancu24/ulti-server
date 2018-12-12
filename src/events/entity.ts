import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { MinLength, IsString, IsDateString } from 'class-validator';
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

  @IsDateString()
  @Column('date', {nullable: true})
  startDate: Date | null

  @IsDateString()
  @Column('date', {nullable: true})
  endDate: Date | null

  @Column('simple-array', {nullable: true})
  teams: Team[] | null


  @OneToMany(() => Game, game => game.event)
  games: Game[] | null;
}