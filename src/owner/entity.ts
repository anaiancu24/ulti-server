import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany} from 'typeorm'
import User from '../users/entity'
import Team from '../team/entity'
import Coach from '../coach/entity'
import Player from '../player/entity';

type votedPlayers = {
malePlayers: Player[]
femalePlayers: Player[]
outMen: Player
outFemale: Player  
}

@Entity()
export default class Owner extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.owners)
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
  players: votedPlayers | null


}