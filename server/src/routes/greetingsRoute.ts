import { Router } from "express";
import { greetings } from "../controllers/greetingsController";

const greetingsRoute = Router();

greetingsRoute.get("/", greetings);

export default greetingsRoute;
