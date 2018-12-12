import { BaseEntity, Entity, PrimaryGeneratedColumn, Column , OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import User from '../users/entity'
import Team from '../team/entity'
import Owner from '../owner/entity'

type Gender = "female" | "male"
@Entity()
export default class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => User, user => user.player)
  @JoinColumn()
  user: User

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  location: string

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  description: string

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  gender: Gender

  @Column('boolean', {nullable: true})
  isNominated: boolean

  @ManyToOne(_ => Team, team => team.players) 
  team: Team | null

  @Column('integer', {nullable: true})
  votes: number | null

  @Column('integer', {nullable: true})
  rank: number | null

  @Column('boolean', {nullable: true})
  selected: boolean


  @ManyToOne(() => Owner, owner => owner.players)
  owners: Owner[] | null
}