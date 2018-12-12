import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, JoinTable } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import Player from '../player/entity'
import Coach from '../coach/entity'
import Owner from '../owner/entity'


@Entity()
export default class Team extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  name: string

  @IsString()
  @MinLength(2)
  @Column('text', {nullable:true})
  location: string

  @Column('integer', { nullable: true })
  totalShares: number

  @OneToMany(_ => Player, player => player.team, { eager: true })
  players: Player[]

  @OneToOne(_ => Coach, coach => coach.team)
  @JoinColumn()
  coach: Coach

  @OneToMany(_ => Owner, owner => owner.team)
  @JoinTable()
  owners: Owner[] 
  
}
