import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
import User from '../users/entity'
// import Team from '../team/entity'
import Owner from '../owner/entity'
// import Selected from '../selected/entity'

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

  @ManyToMany(() => Owner, owner => owner.players)
  // @JoinTable() 
  owners: Owner[] | null










  // @ManyToMany(_ => Team, nominatedTeam => nominatedTeam.nominatedPlayers) 
  // nominatedTeams: Team[] | null

  // @Column('integer', {nullable: true})
  // votes: number | null

  // @Column('integer', {nullable: true})
  // rank: number | null



  // @ManyToOne(() => Selected, selectedTeam => selectedTeam.players)
  // selectedTeam: Selected | null


  
}