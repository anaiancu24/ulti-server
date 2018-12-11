import { BaseEntity, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne} from 'typeorm'
import User from '../users/entity'

@Entity()
export default class Owner extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => User, user => user.player)
  @JoinColumn()
  user: User



}