import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import Owner from '../owner/entity'
import Coach from '../coach/entity'
import Player from '../player/entity'
import Event from '../events/entity'
import Game from '../game/entity'


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
  @Column('text')
  location: string

  @IsString()
  @Column('text')
  logo: string

  @Column('integer')
  totalShares: number

  @OneToMany(_ => Owner, owner => owner.team, {lazy: true})
  owners: Owner[]

  @OneToMany(_ => Coach, coach => coach.nominatedTeam, {lazy: true})
  nominatedCoaches: Coach[] | null

  @ManyToMany(_ => Player, player => player.nominatedTeams, {lazy: true})
  nominatedPlayers: Player[] | null

  @ManyToOne(_ => Event, event => event.teams, {lazy: true})
  event: Event | null

  @OneToMany(_ => Game, game => game.homeTeam, {lazy: true})
  homeGame: Game[] | null

  @OneToMany(_ => Game, game => game.awayTeam, {lazy: true})
  awayGame: Game[] | null
}
