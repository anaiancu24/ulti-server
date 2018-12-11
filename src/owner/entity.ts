import { BaseEntity, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany, Column} from 'typeorm'
import User from '../users/entity'
import Team from '../team/entity'

type Shares = {
  teamName: string,
  numberOfShares: number
}


@Entity()
export default class Owner extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => User, user => user.player)
  @JoinColumn()
  user: User

  @OneToMany(_ => Team, team => team.owner) 
  teams: Team[] | null

  @Column('simple-array', {nullable: true})
  shares: Shares[] | null

}