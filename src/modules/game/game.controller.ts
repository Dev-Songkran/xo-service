import database from "@/configs";
import Game from "@/models/Game.model";
import User from "@/models/User.model";
import { Request, Response } from "express";
import { fn, col, literal } from 'sequelize'
import { chain, map } from 'lodash'

const Controller = {
  all: async (req: Request, res: Response) => {
    const { username } = req.query

    if (!username) res.status(401).json({ code: 1, message: "401 Unauthorized" })

    const game = await Game.findOne({
      attributes: [
        [literal(`(SELECT last_first_player FROM games ORDER BY id DESC LIMIT 0,1)`), "last_first_player"],
        [literal(`COALESCE(SUM(CASE WHEN win='x' THEN 1 else 0 END),0)`), "x"],
        [literal(`COALESCE(SUM(CASE WHEN win='o' THEN 1 else 0 END),0)`), "o"],
        [literal(`COALESCE(SUM(CASE WHEN win='draw' THEN 1 else 0 END),0)`), "draw"],
        [literal(`COALESCE(SUM(CASE WHEN win THEN 1 END),0)`), "total"],
      ],
      include: [
        {
          model: User,
          where: { username },
          required: true,
          attributes: []
        }
      ],
    })


    const data: { player: string, win: number }[] = []

    map(game?.dataValues, (i, k) => {
      if (k === 'x' || k === 'o') data.push({
        player: k,
        win: i
      })
    })

    const last_first_player = game?.dataValues.last_first_player

    return res.json({
      code: 0,
      data,
      game_count: game?.dataValues.total,
      last_first_player,
      draw: game?.dataValues.draw
    })
  },
  update: async (req: Request, res: Response) => {
    const { player_win } = req.body
    const session = req.session.user

    const game = await Game.findOne({
      order: [['id', 'desc']],
      where: {
        userId: session.id
      }
    })
    const last_first_player = game?.dataValues.last_first_player == 'x' ? 'o' : 'x'

    await Game.create({
      userId: session.id,
      win: player_win,
      last_first_player
    })

    res.json({ code: 0, message: 'success' })
  },
}

export default Controller