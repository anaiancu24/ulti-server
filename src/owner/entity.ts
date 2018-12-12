import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, OneToOne } from 'typeorm'
import User from '../users/entity'
import Team from '../team/entity'
import Coach from '../coach/entity'
import Player from '../player/entity';

type VotedPlayers = {
malePlayers: Player[]
femalePlayers: Player[]
outMen: Player
outFemale: Player
}

@Entity()
export default class Owner extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => User, user => user.owner)
  user: User | null

  @ManyToOne(() => Team, team => team.owners) 
  team: Team | null

  @Column('integer', {nullable: true})
  shares: number | null

  @Column('integer', {nullable: true})
  votingPower: number | null

  @ManyToOne(() => Coach, coach => coach.owners) 
  votedCoach: Coach | null

  @OneToMany(_ => Player, player => player.owners)
  players: VotedPlayers | null


}