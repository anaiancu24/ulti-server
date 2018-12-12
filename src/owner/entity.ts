import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, Column} from 'typeorm'
import User from '../users/entity'
import Team from '../team/entity'
import Coach from '../coach/entity'


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

  @ManyToOne(() => Coach, coach => coach.owners) 
  coach: Coach | null

}