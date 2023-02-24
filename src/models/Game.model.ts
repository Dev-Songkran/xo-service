import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import User from './User.model'

@Table({ tableName: 'games' })
class Game extends Model {

  @Column(DataType.STRING)
  last_first_player: string

  @Column(DataType.ENUM("o", "x", "draw"))
  win: string

  @Column
  @ForeignKey(() => User)
  userId: number

  @BelongsTo(() => User)
  user: User
}
export default Game
