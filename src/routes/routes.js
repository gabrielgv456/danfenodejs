//@ts-check

import { Router } from "express";
import { danfeGeneratorRoute } from "../factories/danfeGeneratorRoute.js";

const router = Router()

router.post('/danfeGenerator', danfeGeneratorRoute)

export default router