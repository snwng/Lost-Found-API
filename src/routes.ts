import express from "express";
import itemsRouter from "./modules/items/items.routes"

const router = express.Router();


router.get("/", (req, res) =>
  res.status(200).json({ status: "OK", timestamp: new Date() }),
);

router.use("/items", itemsRouter);

export default router;
