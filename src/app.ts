import dotenv from "dotenv";
import express from "express";
import { addressCallback } from "./services/address-validation";

dotenv.config();
const port = 8080;
const app = express();

app.use(express.json());

app.get("/healthcheck", (_, res) => res.status(200).send());
app.post("/", addressCallback);

app.listen(port, () => {
  console.log("listening on port " + port);
});
