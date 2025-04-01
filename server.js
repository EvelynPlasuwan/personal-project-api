require("dotenv").config()
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const handleErrors = require("./middlewares/error");

//Routing
const authRouter = require("./routes/auth-route");
const userRouter = require("./routes/user-route");
const imageRouter = require('./routes/image-route');
const eventRouter = require('./routes/event-route');
const searchRoutes = require('./routes/search-route');
const app = express();

// middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan("dev"));
app.use(express.json());

// routing - จัดระเบียบ routes ใหม่
app.use("/api/auth", authRouter);     // เปลี่ยนจาก "/" เป็น "/api/auth"
app.use("/api/users", userRouter);    // ใช้แค่ครั้งเดียว
app.use('/api/images', imageRouter);  // เปลี่ยนจาก image เป็น images
app.use('/api/events', eventRouter);  // คงไว้เหมือนเดิม
app.use('/api/search', searchRoutes);
// handle errors
app.use(handleErrors);

// start server
const port = process.env.PORT || 8000  // เปลี่ยนเป็น 8899 ให้ตรงกับ frontend
app.listen(port, () => console.log(`Server is running on port ${port}`));