import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
// import Coach from '../coach/entity'
import Owner from '../owner/entity'
// import Game from '../game/entity'
// import Selected from '../selected/entity';


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

  @OneToMany(_ => Owner, owner => owner.team)
  owners: Owner[]













  // @ManyToMany(_ => Player, nominatedPlayer => nominatedPlayer.nominatedTeams, { eager: true })
  // @JoinTable()
  // nominatedPlayers: Player[] | null

  // @OneToOne(() => Coach, coach => coach.selectedTeam)
  // selectedCoach: Coach | null

  // // @OneToMany(() => Player, player => player.selectedTeam)
  // // @JoinColumn()
  // // selectedPlayers: Player[] | null

  // @ManyToMany(_ => Game, game => game.teams)
  // games: Game[]

  // @OneToOne(() => Selected, selectedTeam => selectedTeam.team, {eager: true})
  // selectedTeam: Selected | null


}
