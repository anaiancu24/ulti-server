import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm'
import { MinLength, IsString, IsBoolean } from 'class-validator'
import User from '../users/entity'
import Owner from '../owner/entity'
import Team from '../team/entity'
import { SocialMedia } from '../coach/entity'

export type Votes = {
  teamName: Team | undefined
  numberOfVotes: number
}

type Gender = "female" | "male"


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
  gender: Gender

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  location: string

  @IsBoolean()
  @Column('boolean', {nullable: true})
  outOfArea: boolean

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  description: string

  @Column('text', {nullable: true})
  socialMedia: SocialMedia | null

  @IsString()
  @Column('text', {nullable: true})
  pictureURL: string | null

  @IsBoolean()
  @Column('boolean')
  hasPaid: boolean


  @ManyToMany(() => Team, team => team.nominatedPlayers, {eager: true})
  @JoinTable()
  nominatedTeams: Team[] | null

  @ManyToMany(() => Owner, owner => owner.players, {lazy: true})
  owners: Owner[] | null

}