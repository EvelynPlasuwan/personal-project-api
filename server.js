require("dotenv").config()
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const handleErrors = require("./middlewares/error");

//Routing
const authRouter = require("./routes/auth-route");
const userRouter = require("./routes/user-route");
const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// routing
app.use("/", authRouter)
app.use("/", userRouter)

// handle errors
app.use(handleErrors);

// start server
const port = process.env.PORT || 8000
app.listen(port, ()=> console.log("Server is running on", port))