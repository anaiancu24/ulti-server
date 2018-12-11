import { BaseEntity, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm'
import Team from '../team/entity'
import User from '../users/entity'

@Entity()
export default class Coach extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => Team, team => team.coach)
  @JoinColumn()
  team: Team

  @OneToOne(_ => User, user => user.coach)
  @JoinColumn()
  user: User
  
}