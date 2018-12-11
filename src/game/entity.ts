import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Exclude } from 'class-transformer';
import { MinLength, IsString, IsEmail } from 'class-validator';


@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  name: string

  @MinLength(2)
  @Column('integer')
  homeScore: number

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


}