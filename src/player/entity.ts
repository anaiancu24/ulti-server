import { BaseEntity, Entity, PrimaryGeneratedColumn, Column , OneToOne, JoinColumn, ManyToOne} from 'typeorm'
import User from '../users/entity'
import Team from '../team/entity'


@Entity()
export default class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number



  @Column('integer')
  rank: number


  @OneToOne(_ => User, user => user.player)
  @JoinColumn()
  user: User

  @ManyToOne(_ => Team, team => team.players) 
  team: Team

}