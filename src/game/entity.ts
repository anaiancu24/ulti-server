import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm'
import { IsString } from 'class-validator'
import Event from '../events/entity'
import Team from '../team/entity'


@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number
  
  @Column('integer', {nullable: true})
  homeScore: number | null

  @Column('integer', {nullable: true})
  awayScore: number | null

  @IsString()
  @Column('text', {nullable: true})
  livestream: string

  @Column('date', {nullable:true})
  date: Date | null

  @IsString()
  @Column('text', {nullable: true})
  hour: string | null

  @IsString()
  @Column('text', {nullable: true})
  stage: string | null

  @Column('json', {nullable:true})
  report: JSON | null

  @ManyToOne(_ => Team, team => team.homeGame, {eager: true})
  homeTeam: Team | null | String

  @ManyToOne(_ => Team, team => team.awayGame, {eager: true})
  awayTeam: Team | null | String

  @ManyToOne(() => Event, event => event.games)
  event: Event | null
}