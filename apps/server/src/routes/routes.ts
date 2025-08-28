import express from "express";
import adminRouter from "./adminRoute.js";
import ProductsRouter from "./productsRouter.ts";

const router: express.Router = express.Router();

// Mount all API routes under /api
// router.use("/admin", adminRouter);
// router.use("/users", usersRouter);
// router.use("/auth/sign-up", signUpController);

router.use("/products", ProductsRouter);

export default router;
