import { BaseEntity, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm'
import Player from '../player/entity'
import Team from '../team/entity'
import Coach from '../coach/entity'


@Entity()
export default class Selected extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(() => Team, team => team.selectedTeam)
  @JoinColumn()
  team: Team | null

  @OneToOne(() => Coach, coach => coach.selectedTeam)
  @JoinColumn()
  coach: Coach | null

  @OneToMany(() => Player, player => player.selectedTeam)
  @JoinColumn()
  players: Player[] | null

}





