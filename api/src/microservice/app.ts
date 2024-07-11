import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import index from "./routes/index";
import users from "./routes/users.route";
import schedule from "./routes/schedule.route";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.disable("x-powered-by");

app.use("/", index);
app.use("/users", users);
app.use("/schedule", schedule);

export default app;
