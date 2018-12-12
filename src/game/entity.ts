import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable} from 'typeorm'
import { IsString } from 'class-validator'
import Event from '../events/entity'
import Team from '../team/entity'

@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  // @IsString()
  // @MinLength(2)
  // @Column('text')
  // homeTeam: string

  // @IsString()
  // @MinLength(2)
  // @Column('text')
  // awayTeam: string

  
  @Column('integer')
  homeScore: number

  @Column('integer')
  awayScore: number

  @IsString()
  @Column('text', {nullable: true})
  livestream: string

  @Column('date', {nullable:true})
  date: Date | null


  // @Column('json')
  // report: JSON

  @ManyToMany(_ => Team, team => team.games)
  @JoinTable()
  teams: Team[] 

  @ManyToOne(() => Event, event => event.games)
  event: Event | null

}