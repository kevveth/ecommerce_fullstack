import { Router } from "express";
import { getCategories, getProducts } from "@/services/products.ts";

const router: Router = Router();

router.get("/", getProducts);
router.get("/categories", getCategories);

export { router as productsRouter };
