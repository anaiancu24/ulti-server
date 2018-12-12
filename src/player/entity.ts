import { BaseEntity, Entity, PrimaryGeneratedColumn, Column , OneToOne, JoinColumn, ManyToOne, ManyToMany } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import User from '../users/entity'
import Team from '../team/entity'
import Owner from '../owner/entity'

type Gender = "female" | "male"

type SocialMedia = {
  facebook: string
  instagram: string
  twitter: string
}

@Entity()
export default class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => User, user => user.player)
  @JoinColumn()
  user: User

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  location: string

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  gender: Gender

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  description: string

  @Column('text', {nullable: true})
  socialMedia: SocialMedia

  @Column('boolean', {nullable: true})
  isNominated: boolean

  @ManyToMany(_ => Team, nominatedTeam => nominatedTeam.nominatedPlayers) 
  nominatedTeams: Team[] | null

  // @ManyToOne(_ => Team, team => team.id, {eager: true}) 
  // nominatedTeams: Team[] | null

  // @ManyToOne(() => Team, selectedTeam => selectedTeam.selectedPlayers, { eager: true })
  // selectedTeam: Team | null

  @Column('integer', {nullable: true})
  votes: number | null

  @Column('integer', {nullable: true})
  rank: number | null

  @ManyToOne(() => Owner, owner => owner.players)
  owners: Owner[] | null
}