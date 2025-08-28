import { Router } from "express";
import {
  getProductsController,
  getCategoriesController,
} from "@/controllers/products.ts";

const router: Router = Router();

router.get("/", getProductsController);
router.get("/categories", getCategoriesController);

export default router;
