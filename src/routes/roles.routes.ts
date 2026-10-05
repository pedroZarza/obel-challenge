import { Router, Request, Response } from "express"
import { createRole, editRoleById, getAllRoles, getRoleById } from "../controllers/roles.controller"
import { validator } from "../middlewares/validator"
import { createRoleSchema, updateRoleSchema } from "../schemas/validation.schemas"

const router = Router()

router.get("/", getAllRoles)
router.get("/:roleId", getRoleById)
router.post("/", validator(createRoleSchema), createRole)
router.patch("/:roleId", validator(updateRoleSchema), editRoleById)


export default router