import { Model, Table, Column, BeforeCreate, HasMany } from 'sequelize-typescript'
import bcrypt from 'bcrypt'
import Game from './Game.model'

@Table({ tableName: 'users' })
class User extends Model {

  @Column
  username: string

  @Column
  password: string

  @HasMany(() => Game)
  games: Game

  @BeforeCreate
  static async HashPassword(instance: User) {
    const salt = bcrypt.genSaltSync()
    instance.password = bcrypt.hashSync(instance.password, salt)
    return instance
  }
}

export default User