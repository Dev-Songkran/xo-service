import User from "@/models/User.model";
import { Request, Response, NextFunction } from "express";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = req.session.user;

  if (!session) {
    return res.status(401).json({
      isLoggedIn: false,
      user: null,
    });
  }

  const user = await User.findOne({
    where: { id: session.id }
  })

  if (!user) {
    delete req.session.user;
    req.session.save();

    return res.status(401).json({
      isLoggedIn: false,
      user: null,
    });
  }

  req.session.user = session;
  next();
};