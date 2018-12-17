import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToOne, JoinTable, ManyToMany } from 'typeorm'
import User from '../users/entity'
import Team from '../team/entity'
import Coach from '../coach/entity'
import Player from '../player/entity'


@Entity()
export default class Owner extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => User, user => user.owner, {eager: true})
  @JoinColumn()
  user: User

  @ManyToOne(() => Team, team => team.owners, {eager: true, nullable: true}) 
  team: Team

  @Column('integer', {nullable: true})
  shares: number

  @Column('integer', {nullable: true})
  votingPower: number

  // Voting process
  @ManyToOne(() => Coach, coach => coach.owners, {eager: true, nullable: true}) 
  coach: Coach | null

  @ManyToMany(_ => Player, player => player.owners, {eager: true})
  @JoinTable()
  players: Player[]

}