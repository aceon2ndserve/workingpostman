import { Router } from "express";
import fetch from "node-fetch";
import { addressCallback } from "../services/address-validation/index.js";
export const router = Router();


router.post("/", addressCallback);
