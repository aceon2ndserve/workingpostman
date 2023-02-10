import express from "express";
import dotenv from "dotenv";
import { router } from "./routers/router.js";

dotenv.config();
const port = 8080;
const app = express();

app.use(express.json());

app.use("/", router);

app.listen(port, () => {
  console.log("listening on port " + port);
});
