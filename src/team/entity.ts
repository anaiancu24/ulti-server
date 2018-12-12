import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, JoinTable, ManyToMany } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import Player from '../player/entity'
import Coach from '../coach/entity'
import Owner from '../owner/entity'
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
  @Column('text', {nullable:true})
  location: string

  @Column('integer', { nullable: true })
  totalShares: number

  @OneToMany(_ => Player, player => player.nominatedTeams, { eager: true })
  nominatedPlayers: Player[] | null

  @OneToMany(() => Player, player => player.selectedTeam)
  selectedPlayers: Player[] | null

  @ManyToMany(_ => Coach, coach => coach.nominatedTeams)
  @JoinColumn()
  nominatedCoaches: Coach[] | null

  @OneToOne(() => Coach, coach => coach.selectedTeam)
  selectedCoach: Coach | null



  @OneToMany(_ => Owner, owner => owner.team)
  @JoinTable()
  owners: Owner[] 

  @ManyToMany(_ => Game, game => game.teams)
  games: Game[]
  
}
