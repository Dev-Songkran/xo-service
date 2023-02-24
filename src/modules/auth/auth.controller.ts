import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import database from "@/configs";

const Controller = {
  register: async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!username || !password) return res.status(422).json({ "code": 1, message: "Required Username & Password" })

    try {
      const [_, created] = await database.models.User.findOrCreate({
        where: {
          username
        },
        defaults: {
          username,
          password,
        }
      })

      if (!created) return res.status(422).json({ "code": 1, message: "มีชื่อผู้ใช้งานนี้แล้วในระบบ" })

      return res.json({ code: 0, message: "success" })
    } catch (error) {
      return res.status(422).json(error)
    }

  },
  authen: async (req: Request, res: Response) => {
    const {
      username,
      password
    } = req.body

    const data = await database.models.User.findOne({ where: { username } })

    if (!data) return res.status(422).json({ code: 1, message: "ไม่พบชื่อผู้ใช้งานหรือรหัสผ่านผิดพลาด" })

    if (!await bcrypt.compare(password, data.dataValues.password)) {
      return res.status(401).json({
        message: 'ชื่อผู้ใช้งานหรือรหัสผ่านผิดพลาด'
      })
    }

    delete data.dataValues.password
    req.session.user = data
    res.json({ code: 0, message: "success" });
  },
  me: async (req: Request, res: Response) => {
    return res.json({
      isLoggedIn: true,
      user: req.session.user
    })
  },
  signout: async (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ code: 1, message: err.message })
      }

      res.status(200).json({
        code: 0,
        message: 'success'
      })
    })
  }
}

export default Controller