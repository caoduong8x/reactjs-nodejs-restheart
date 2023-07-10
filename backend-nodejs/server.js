import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import * as appConfig from "./config/setup";
import swaggerUi from "swagger-ui-express";

const swaggerFile = require("./swagger-output.json");
let indexRouter = require("./routes/index");
let constRes = require("./common/constants/response");

const limiter = rateLimit({
  windowMs: appConfig.WINDOW_MS,
  max: appConfig.LIMIT_REQ_PER_WMS,
  message: constRes.RESPONSE_ERR_TOO_MANY_REQUEST,
});

let app = express();
app.use(limiter);
app.use(helmet());
app.use(logger("dev"));
// app.use(express.json())
app.use(express.json({ limit: "50Mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(function (req, res, next) {
  req.timestamp = Date.now();
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(path.join(__dirname, "views")));

app.use("/api", indexRouter);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// chạy web
app.use(express.static(path.join(__dirname, "build")));
// app.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
//     if (err) {
//       res.status(500).send(err)
//     }
//   })
// })

module.exports = app;
