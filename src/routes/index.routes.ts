import { Router } from "express";
import rolesRoutes from "../routes/roles.routes"
import userRoutes from "../routes/users.routes"

const router = Router()

router.use("/roles", rolesRoutes)
router.use("/users", userRoutes)

export default router