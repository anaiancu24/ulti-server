import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Exclude } from 'class-transformer';
import { MinLength, IsString, IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt'

type Account = 'player' | 'coach' | 'owner' | 'member'

@Entity()
export default class Owner extends BaseEntity {

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

  @IsString()
  @MinLength(2)
  @Column('text')
  account: Account

  @IsString()
  @MinLength(8)
  @Column('text')
  @Exclude({ toPlainOnly: true })
  password: string

//   @OneToMany(() => Ticket, ticket => ticket.seller)
//   tickets: Ticket[];


  async setPassword(rawPassword: string) {
    const hash = await bcrypt.hash(rawPassword, 10)
    this.password = hash
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password)
  }
}