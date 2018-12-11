import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import Event from '../events/entity'

@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  homeTeam: string

  @IsString()
  @MinLength(2)
  @Column('text')
  awayTeam: string
  
  @Column('integer')
  homeScore: number

  @Column('integer')
  awayScore: number

  // @Column('json')
  // report: JSON

  @ManyToOne(() => Event, event => event.games)
  event: Event | null
}