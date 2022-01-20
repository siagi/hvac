const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const customerRoute = require('./routes/customer')
const taskRoute = require('./routes/task')
const noteRoute = require('./routes/note')

const app = express();
dotenv.config()


mongoose.connect(process.env.MONGO_URL)
        .then(()=>console.log("DB connection Successfull"))
        .catch((error)=>console.log(error));

app.use(express.json());
app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/customer",customerRoute)
app.use("/api/task",taskRoute);
app.use("/api/note",noteRoute)

app.listen(process.env.PORT || 5000,()=>{
    console.log("Backend server is running on 5000");
})