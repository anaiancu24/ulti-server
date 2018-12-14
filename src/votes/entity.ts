import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'


@Entity()
export class CoachVote extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('integer')
  coachId: number

  @Column('integer')
  ownerId: number

  @Column('integer')
  teamId: number

  @Column('integer')
  votes: number

}

@Entity()
export class PlayerVote extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('integer')
  playerId: number

  @Column('integer')
  ownerId: number

  @Column('integer')
  teamId: number

  @Column('integer')
  votes: number

}



