import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { MinLength, IsString} from 'class-validator';
import Team from '../team/entity'
import Game from '../game/entity'

@Entity()
export default class Event extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  name: string

  @IsString()
  @MinLength(2)
  @Column('text')
  location: string
  
  @Column('date')
  startDate: Date

  @Column('date')
  endDate: Date

  @OneToMany(() => Team, team => team.event, {eager: true, nullable: true})
  teams: Team[] | null

  @OneToMany(() => Game, game => game.event, {eager: true, nullable: true})
  games: Game[] | null
}
