import { BaseEntity, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column, OneToMany, ManyToOne } from 'typeorm'
import { MinLength, IsString, IsBoolean } from 'class-validator'
import User from '../users/entity'
import Owner from '../owner/entity'
import Team from '../team/entity'


export type SocialMedia = {
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

  @Column('text', {nullable: true})
  pictureURL: string | null
  
  @IsBoolean()
  @Column('boolean')
  hasPaid: boolean

  @OneToMany(_ => Owner, owner => owner.coach, {lazy: true})
  owners: Owner[]

  @ManyToOne(_ => Team, team => team.nominatedCoaches, {eager: true})
  nominatedTeam: Team | null

}