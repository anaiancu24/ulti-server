import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToOne, JoinTable, ManyToMany } from 'typeorm'
import User from '../users/entity'
import Team from '../team/entity'
import Coach from '../coach/entity'
import Player from '../player/entity'

// type VotedPlayers = {
// malePlayers: Player[]
// femalePlayers: Player[]
// outMen: Player
// outFemale: Player
// }

@Entity()
export default class Owner extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => User, user => user.owner)
  user: User | null

  @ManyToOne(() => Team, team => team.owners, {eager: true}) 
  team: Team | null

  @Column('integer', {nullable: true})
  shares: number | null

  @Column('integer', {nullable: true})
  votingPower: number | null

  // Voting process
  @ManyToOne(() => Coach, coach => coach.owners, {eager: true}) 
  coach: Coach | null

  @ManyToMany(_ => Player, player => player.owners, {eager: true})
  @JoinTable()
  players: Player[] | null

}