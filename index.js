const express = require('express');
const fileupload = require("express-fileupload");
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const customerRoute = require('./routes/customer')
const taskRoute = require('./routes/task')
const noteRoute = require('./routes/note')
const uploadRoute = require('./routes/upload')
const testRoute = require('./routes/test')
const updateOrder = require('./routes/updateOrder')
// const orderRoute = require('./routes/order')


const app = express();
dotenv.config()

app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/customer",customerRoute)
app.use("/api/task",taskRoute);
app.use("/api/note",noteRoute)
app.use("/api/upload",uploadRoute)
app.use("/api/test",testRoute)
app.use("/api/updateorder",updateOrder)
// app.use("/api/order", orderRoute)

app.listen(process.env.PORT || 5000,()=>{
    console.log("Backend server is running on 5000");
})