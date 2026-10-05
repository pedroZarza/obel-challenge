import { Router } from "express"
import { assignRole, getAllUsers, getUserRoles, removeRole } from "../controllers/users.controller"

const router = Router()

router.get("/", getAllUsers)
router.get("/:userId/roles", getUserRoles)
router.put("/:userId/roles/:roleId", assignRole)
router.delete("/:userId/roles/:roleId", removeRole)




export default router