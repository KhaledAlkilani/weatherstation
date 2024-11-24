import { Request, Response } from "express";

export const greetings = async (req: Request, res: Response) => {
  res.send("Welcome to Weather Station!");
};
