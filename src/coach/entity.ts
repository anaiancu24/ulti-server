import { BaseEntity, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column, OneToMany } from 'typeorm'
import { MinLength, IsString } from 'class-validator'
// import Team from '../team/entity'
import User from '../users/entity'
import Owner from '../owner/entity';
// import Selected from '../selected/entity';


type SocialMedia = {
  facebook: string
  instagram: string
  twitter: string
}

@Entity()
export default class Coach extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @OneToOne(_ => User, user => user.coach)
  @JoinColumn()
  user: User

  @IsString()
  @MinLength(2)
  @Column('text', {nullable: true})
  description: string

  @Column('text', {nullable: true})
  socialMedia: SocialMedia

  
  @Column('boolean', {nullable: true})
  isNominated: boolean

  @Column('integer', {nullable: true})
  votes: number | null

  @Column('integer', {nullable: true})
  rank: number | null

  @OneToMany(_ => Owner, owner => owner.coach)
  owners: Owner[]




  // @ManyToMany(_ => Team, teams => teams.nominatedCoaches) 
  // nominatedTeams: Team[] | null

  // @OneToOne(_ => Selected, selectedTeam => selectedTeam.coach, {eager: true})
  // @JoinColumn()
  // selectedTeam: Team | null




}