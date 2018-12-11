import { BaseEntity, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import Team from '../team/entity'
import User from '../users/entity'

@Entity()
export default class Coach extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  description: string


  @OneToOne(_ => Team, team => team.coach)
  @JoinColumn()
  team: Team | null

  @OneToOne(_ => User, user => user.coach)
  @JoinColumn()
  user: User
  
  @Column('boolean', {nullable: true})
  isNominated: boolean

  @Column('integer', {nullable: true})
  rank: number | null
}