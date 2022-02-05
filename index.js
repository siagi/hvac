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

const app = express();
dotenv.config()


mongoose.connect(process.env.MONGO_URL)
        .then(()=>console.log("DB connection Successfull"))
        .catch((error)=>console.log(error));

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

app.listen(process.env.PORT || 5000,()=>{
    console.log("Backend server is running on 5000");
})