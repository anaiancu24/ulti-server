import { createConnection } from 'typeorm'
import { DefaultNamingStrategy } from 'typeorm/naming-strategy/DefaultNamingStrategy'
import { NamingStrategyInterface } from 'typeorm/naming-strategy/NamingStrategyInterface'
import { snakeCase } from 'typeorm/util/StringUtils'
import User from './users/entity'
import Player from './player/entity'
import Owner from './owner/entity'
import Team from './team/entity'
import Coach from './coach/entity'
import Game from './game/entity'
import Event from './events/entity'
import { CoachVote, PlayerVote } from './votes/entity'




class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {

  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName) + 's';
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join("_"));
  }

  columnNameCustomized(customName: string): string {
    return customName;
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}

export default () =>
  createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL || 'postgres://postgres:test1234@localhost:5432/postgres',
    entities: [
      User,
      Player,
      Owner,
      Team,
      Coach,
      Game,
      Event,
      CoachVote,
      PlayerVote
      

    ],
    synchronize: true,
    logging: true,
    namingStrategy: new CustomNamingStrategy()
  })
    .then(_ => console.log('Connected to Postgres with TypeORM'))