require("dotenv").config()
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRouter = require("./routes/auth-route");
const app = express();
const handleErrors = require("./middlewares/error");
// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(handleErrors);
// routing
app.use("/", authRouter)

// start server
const port = process.env.PORT || 8000
app.listen(port, ()=> console.log("Server is running on", port))