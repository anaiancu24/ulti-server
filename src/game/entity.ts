import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm'
import { IsString } from 'class-validator'
import Event from '../events/entity'
// import Team from '../team/entity'

@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number
  
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

  // @ManyToMany(_ => Team, team => team.games)
  // @JoinTable()
  // teams: Team[] 

  @ManyToOne(() => Event, event => event.games)
  event: Event | null

}