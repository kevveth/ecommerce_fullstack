import { Request, Response, NextFunction, RequestHandler } from "express-serve-static-core";
import * as Users from "../models/users";
import asyncErrorHandler from "../utils/AsyncErrorHandler";
import { User } from "../types/user";

interface UserDTO {
  data: User;
}

export const getUserWithId = asyncErrorHandler(
  async (
    req: Request<{ id: string }>,
    res: Response<UserDTO>,
    next: NextFunction
  ) => {
    const id = parseInt(req.params.id);

    if (!id) {
      return new Error("ID is required");
    }

    const user = await Users.get(id);
    return res.status(200).send({ data: user });
  }
);
