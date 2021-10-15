import express from "express";
import { authenticate } from "../middlewares/auth";
import * as categoryService from "../services/category";
import { HTTP_STATUS_CODES } from "../utils/constants";

const router = express.Router();

router.get("/", authenticate(), async (req, res, next) => {
  try {
    const biddingRecords = await categoryService.getCategories();
    res.json(biddingRecords);
  } catch (err) {
    next(err);
  }
});

export default {
  prefix: "/v1/category",
  routerInstance: router,
};
