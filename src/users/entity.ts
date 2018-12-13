import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { Exclude } from 'class-transformer';
import { MinLength, IsString, IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt'
import Player from '../player/entity'
import Coach from '../coach/entity'
import Owner from '../owner/entity'

type Account = 'player' | 'coach' | 'owner' | 'member' | 'admin'

@Entity()
export default class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  firstName: string

  @IsString()
  @MinLength(2)
  @Column('text')
  lastName: string

  @IsEmail()
  @Column('text')
  email: string

  @Column('simple-array')
  account: Account[]

  @IsString()
  @MinLength(8)
  @Column('text')
  @Exclude({ toPlainOnly: true })
  password: string

  @OneToOne(_ => Player, player => player.user)
  player: Player

  @OneToOne(_ => Coach, coach => coach.user)
  coach: Coach

  @OneToOne(_ => Owner, owner => owner.user, {eager: true})
  owner: Owner

  async setPassword(rawPassword: string) {
    const hash = await bcrypt.hash(rawPassword, 10)
    this.password = hash
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password)
  }
}