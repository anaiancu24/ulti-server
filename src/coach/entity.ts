import { BaseEntity, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column, OneToMany } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import Team from '../team/entity'
import User from '../users/entity'
import Owner from '../owner/entity';


type SocialMedia = {
  facebook: string
  instagram: string
  twitter: string
}

@Entity()
export default class Coach extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => User, user => user.coach)
  @JoinColumn()
  user: User

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  description: string

  @Column('text', {nullable: true})
  socialMedia: SocialMedia

  @OneToOne(_ => Team, team => team.coach)
  @JoinColumn()
  team: Team | null
  
  @Column('boolean', {nullable: true})
  isNominated: boolean

  @Column('integer', {nullable: true})
  votes: number | null

  @Column('integer', {nullable: true})
  rank: number | null

  @Column('boolean', {nullable: true})
  selected: boolean

  @OneToMany(_ => Owner, owner => owner.votedCoach)
  @JoinColumn()
  owners: Owner[]
}