import { Router } from "express";
import user from "./app/controllers/users.js";

const router = new Router();

router.get("/users", user.index);
router.get("/users/:id", user.show);
router.post("/users", user.create);
router.put("/users/:id", user.update);
router.delete("/users/:id", user.destroy);

export default router;
