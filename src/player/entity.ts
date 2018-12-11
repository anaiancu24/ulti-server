import { BaseEntity, Entity, PrimaryGeneratedColumn, Column , OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import User from '../users/entity'
import Team from '../team/entity'


@Entity()
export default class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  location: string

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  description: string

  @Column('boolean', {nullable: true})
  isNominated: boolean


  // @Column('integer', {nullable: true})
  // rank: number


  @OneToOne(_ => User, user => user.player)
  @JoinColumn()
  user: User

  @ManyToOne(_ => Team, team => team.players) 
  team: Team

}