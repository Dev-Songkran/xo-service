import { Sequelize } from "sequelize-typescript"

const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS

const database = new Sequelize({
  dialect: "mariadb",
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASS,
  port: 3306,
  pool: {
    min: 5,
    max: 10,
  },
  models: [__dirname + '/../models/*.model.{ts,js}'],
})


export default database