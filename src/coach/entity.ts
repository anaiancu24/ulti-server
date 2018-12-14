import { BaseEntity, Entity, PrimaryGeneratedColumn, JoinColumn, JoinTable, OneToOne, Column, OneToMany, ManyToMany } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import User from '../users/entity'
import Owner from '../owner/entity'
import Team from '../team/entity'
import {Votes} from '../player/entity'


type SocialMedia = {
  facebook: string
  instagram: string
  twitter: string
}

@Entity()
export default class Coach extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => User, user => user.coach, {eager: true})
  @JoinColumn()
  user: User

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  description: string

  @Column('text', {nullable: true})
  socialMedia: SocialMedia | null

  
  @Column('boolean', {nullable: true})
  hasPaid: boolean

  @Column('json', {nullable: true})
  votes: Votes | null

  @Column('integer', {nullable: true})
  rank: number | null

  @OneToMany(_ => Owner, owner => owner.coach)
  owners: Owner[]

  @ManyToMany(_ => Team, team => team.nominatedCoaches, {eager: true})
  @JoinTable()
  nominatedTeams: Team[] | null

}