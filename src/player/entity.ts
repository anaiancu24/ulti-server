import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import User from '../users/entity'
import Owner from '../owner/entity'
import Team from '../team/entity'

type Votes = {
  team: Team,
  numberOfVotes: number
}

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

  @OneToOne(_ => User, user => user.player, { eager: true})
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

  @Column('integer', {nullable: true})
  votes: Votes | null

  @Column('integer', {nullable: true})
  rank: number | null

  @ManyToMany(() => Owner, owner => owner.players)
  owners: Owner[] | null

  @ManyToMany(() => Team, team => team.nominatedPlayers, {eager: true})
  nominatedTeams: Team[] | null

}